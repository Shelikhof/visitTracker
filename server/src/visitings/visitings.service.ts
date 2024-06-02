import { Injectable } from '@nestjs/common';
import { CreateVisitingDto, IVisitingStudent } from './dto/create-visiting.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from 'src/groups/entities/group.entity';
import { Praepostor } from 'src/groups/entities/praepostor.entity';
import { Student } from 'src/groups/entities/student.entity';
import { Visiting } from './entities/visiting.entity';
import { Op } from 'sequelize';
import { ICreateSummary } from 'src/groups/interfaces/createSummary.interface';
import * as exceljs from 'exceljs';
import { log } from 'console';
import { User } from 'src/users/entities/user.entity';
import { BotService } from 'src/bot/bot.service';
import * as path from 'path';

@Injectable()
export class VisitingsService {
  constructor(
    @InjectModel(Group) private readonly groupRepository: typeof Group,
    @InjectModel(Student) private readonly studentRepository: typeof Student,
    @InjectModel(Visiting) private readonly visitingRepository: typeof Visiting,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Praepostor)
    private readonly praepostorRepository: typeof Praepostor,
    private readonly botService: BotService,
  ) {}
  async create(createVisitingDto: CreateVisitingDto) {
    // const group = await this.getGroupByRoleAndId(
    //   createVisitingDto.userJwtData.role,
    //   createVisitingDto.userJwtData.id,
    // );
    const group = await this.groupRepository.findOne({
      where: { id: createVisitingDto.groupId },
      raw: true,
    });

    const { startDay, endDay } = this.getTodayStartEnd();
    log(startDay, endDay);
    //получение всех посещений группы за день
    const visitings = await this.visitingRepository.findAll({
      where: {
        groupId: group.id,
        date: { [Op.between]: [startDay, endDay] },
      },
      raw: true,
    });

    log(createVisitingDto);
    //если посещения были, то сохраняем изменения, иначе создаём новые записи
    if (visitings.length > 0) {
      for (const student of createVisitingDto.students) {
        const visiting = await this.visitingRepository.findOne({
          where: {
            studentId: student.id,
            date: { [Op.between]: [startDay, endDay] },
          },
        });

        visiting.isVisit = student.isVisit;
        visiting.isEat = student.isEat;
        visiting.isRespectfulReason =
          !student.isVisit && student.isRespectfulReason;
        await visiting.save();
      }
    } else {
      for (const student of createVisitingDto.students) {
        await this.visitingRepository.create({
          isVisit: student.isVisit,
          isRespectfulReason: !student.isVisit && student.isRespectfulReason,
          date: this.getTodayWithTimeZone(),
          studentId: student.id,
          groupId: group.id,
          isEat: student.isEat,
        });
      }
    }

    const curator = await this.userRepository.findOne({
      where: { id: group.curatorId },
    });

    const students = await this.studentRepository.findAll({
      where: { groupId: group.id },
      raw: true,
    });

    if (curator)
      this.botService.writeMessageToUser(
        curator.tgId,
        this.generateVisitingMessage(
          createVisitingDto.students,
          group.name,
          students,
        ),
      );

    return;
  }

  //получение отчёта за сегодня
  async getReport(groupId: string) {
    // const group = await this.getGroupByRoleAndId(
    //   userJwtData.role,
    //   userJwtData.id,
    // );

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      raw: true,
    });

    const students = await this.studentRepository.findAll({
      where: { groupId: group.id },
      order: [['fullName', 'ASC']],
      raw: true,
      attributes: ['id', 'fullName', 'isIP'],
    });

    const { startDay, endDay } = this.getTodayStartEnd();

    log(startDay, endDay);

    const visitings = await this.visitingRepository.findAll({
      where: {
        groupId: group.id,
        date: { [Op.between]: [startDay, endDay] },
      },
      include: [{ model: Student, attributes: ['id', 'fullName', 'isIP'] }],
      raw: true,
    });

    //если посещения были, то отправляем данные из бд, иначе отправляем массив с исходными данными (студенты, флаг isVisit = true)
    if (visitings.length > 0) {
      const transformedVisitings = visitings
        .map((item) => ({
          id: item['student.id'],
          fullName: item['student.fullName'],
          isVisit: !!item.isVisit,
          isRespectfulReason: !!item.isRespectfulReason,
          isIP: !!item['student.isIP'],
          isEat: !!item.isEat,
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
      return {
        isBudget: !!group.isBudget,
        date: this.getTodayWithTimeZone(),
        students: transformedVisitings,
      };
    }

    //форматирование данных о студентах
    const formattedStudents = students
      .map((student) => ({
        id: student.id,
        fullName: student.fullName,
        isIP: !!student.isIP,
        isVisit: true,
        isEat: group.isBudget ? true : null,
        isRespectfulReason: null,
      }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    return {
      isBudget: !!group.isBudget,
      date: this.getTodayWithTimeZone(),
      students: formattedStudents,
    };
  }

  //создание сводки за месяц по типу
  async getSummary(groupId: string, month: string, year: string, type: string) {
    log(type);
    // const group = await this.getGroupByRoleAndId(
    //   userJwtData.role,
    //   userJwtData.id,
    // );

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      raw: true,
    });

    const students = await this.studentRepository.findAll({
      where: { groupId: group.id },
      order: [['fullName', 'ASC']],
      raw: true,
      attributes: ['id', 'fullName', 'isIP'],
    });

    const days = this.getDaysOfMonth(month, year);
    const { firstDay, lastDay } = this.getFirstAndLastDayOfMonth(month, year);

    //получение посещений группы за месяц
    const studentsVisitings = {};

    //получение всех посещений группы за месяц
    for (const student of students) {
      //получение посещений студента за месяц
      const visitings = await this.visitingRepository.findAll({
        where: {
          groupId: group.id,
          date: { [Op.between]: [firstDay, lastDay] },
          studentId: student.id,
        },
        include: [{ model: Student, attributes: ['id', 'fullName'] }],
        order: [['date', 'ASC']],
        raw: true,
      });

      let visitingsIndex = 0;

      //форматирование посещений (если данных нет, то ставим --, иначе isVisit), проходимся по массиву days, потому что необходимо скорректировать посещения по дням в месяце
      const monthVisitings = days.map((item) => {
        if (new Date(visitings[visitingsIndex]?.date).getDate() == item) {
          if (visitings[visitingsIndex]?.isVisit == null) {
            return `--`;
          }

          if (type === 'visitings') {
            const value = !!visitings[visitingsIndex].isVisit
              ? 'О'
              : !!visitings[visitingsIndex].isRespectfulReason
                ? 'УП'
                : 'Н';
            visitingsIndex += 1;
            return value;
          }

          if (type === 'eatings') {
            const value = !!visitings[visitingsIndex].isEat ? 'О' : 'Н';
            visitingsIndex += 1;
            return value;
          }
        } else {
          return `--`;
        }
      });

      studentsVisitings[student.fullName] = monthVisitings;
    }

    const curator = await this.userRepository.findOne({
      where: { id: group.curatorId },
      raw: true,
    });

    const res = {
      dateData: {
        month,
        year,
        firstDay,
        lastDay,
        dayCount: days.length,
        days: days,
      },
      group: {
        name: group.name,
        curator: curator.fullName,
      },
      studentsVisitings,
    };

    return res;
  }

  //получить группу пользователя по его роли и id
  private async getGroupByRoleAndId(role: string, id: string) {
    if (role === 'curator')
      return this.groupRepository.findOne({
        where: { curatorId: id },
        raw: true,
      });

    if (role === 'praepostor') {
      const praepostor = await this.praepostorRepository.findOne({
        where: { userId: id },
        raw: true,
      });
      if (!praepostor) return null;
      return this.groupRepository.findOne({
        where: { id: praepostor.groupId },
        raw: true,
      });
    }
  }

  private getTodayStartEnd() {
    const today = this.getTodayWithTimeZone();
    log(today);
    const startDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 0,
      Number(process.env.TIMEZONE) % 24,
    );
    const endDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      Number(process.env.TIMEZONE) % 24,
    );
    return { startDay, endDay };
  }

  private getTodayWithTimeZone() {
    const today = new Date();
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 0,
      today.getHours() + Number(process.env.TIMEZONE),
    );
  }

  private getDaysOfMonth(month: string, year: string) {
    const date = new Date(`${month} 1, ${year}`);
    const numberOfDays = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();
    const daysOfMonth = Array.from(
      { length: numberOfDays },
      (_, index) => index + 1,
    );
    return daysOfMonth;
  }

  private getFirstAndLastDayOfMonth(month: string, year: string) {
    const firstDay = new Date(`${month} 1, ${year}`);
    firstDay.setHours(firstDay.getHours() + 3);
    const lastDay = new Date(Number(year), firstDay.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);
    lastDay.setHours(lastDay.getHours() + 3);
    return { firstDay, lastDay };
  }

  async generateSummaryTable(
    groupId: string,
    month: string,
    year: string,
    type: string,
  ) {
    const { dateData, studentsVisitings, group } = await this.getSummary(
      groupId,
      month,
      year,
      type,
    );

    const tableTemplate = new exceljs.Workbook();
    await tableTemplate.xlsx.readFile(
      // __dirname + '\\..\\..\\summaryTemplate.xlsx',
      path.resolve(__dirname, '../../summaryTemplate.xlsx'),
    );

    const worksheet = tableTemplate.getWorksheet('шаблон');
    worksheet.name = this.monthEnum[dateData.month];

    worksheet.getCell(1, 3).value =
      `Отделение "Ярославское-3" по адресу: Хибиннский проезд, дом 11`;
    worksheet.getCell(2, 1).value =
      `                                                                                                      ${type === 'visitings' ? 'Табель посещения' : 'Табель учета питания'} группы № ${group.name}                                            ${this.monthEnum[dateData.month]} ${dateData.year}г.`;

    worksheet.getCell(34, 2).value =
      `   Куратор                         _____________________________________             ${this.formatName(group.curator)}																	    `;

    let currentRow = 4;

    //запись дней
    for (let i = 0; i < 31; i++) {
      if (i < dateData.dayCount) {
        worksheet.getCell(currentRow, i + 3).value = dateData.days[i];
      } else {
        worksheet.getCell(currentRow, i + 3).value =
          i + 1 - dateData.days.length;
      }
    }

    currentRow += 1;

    //запись данных о посещениях
    for (const student of Object.keys(studentsVisitings)) {
      worksheet.getCell(currentRow, 2).value = student;

      studentsVisitings[student].forEach((item, index) => {
        if (item !== '--')
          worksheet.getCell(currentRow, index + 3).value = item;
      });
      currentRow += 1;
    }

    const buffer = await tableTemplate.xlsx.writeBuffer();
    return buffer;
  }

  monthEnum = {
    january: 'январь',
    february: 'февраль',
    march: 'март',
    april: 'апрель',
    may: 'май',
    june: 'июнь',
    july: 'июль',
    august: 'август',
    september: 'сентябрь',
    october: 'октябрь',
    november: 'ноябрь',
    december: 'декабрь',
  };

  //форматирование имени из полного формата ФИО в И.О.Фамилия
  formatName(name: string) {
    try {
      const parts = name.trim().split(' ');
      const firstNameInitial = parts[0];
      const middleNameInitial = parts[1];
      const lastName = parts[2];
      if (lastName)
        return `${lastName[0] || ''}.${middleNameInitial[0] || ''}.${firstNameInitial || ''}`;
      return `${middleNameInitial[0] || ''}.${firstNameInitial || ''}`;
    } catch (e) {
      return name;
    }
  }

  generateVisitingMessage(
    studentsVisitings: IVisitingStudent[],
    groupName: string,
    studentsData: Student[],
  ) {
    const date = this.getTodayWithTimeZone();
    const formatedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;

    const IP = [];
    const respReason = [];
    const nonRespReason = [];

    const visitCount = studentsVisitings.reduce(
      (acc, _, i) => (studentsVisitings[i].isVisit ? acc + 1 : acc),
      0,
    );

    for (const student of studentsVisitings) {
      if (student.isVisit) continue;

      const index = studentsData.findIndex((item) => item.id === student.id);

      if (studentsData[index].isIP) {
        IP.push(studentsData[index].fullName);
        continue;
      }
      const visit = studentsVisitings.findIndex((el) => el.id === student.id);

      if (studentsVisitings[visit].isRespectfulReason)
        respReason.push(studentsData[index].fullName);
      else nonRespReason.push(studentsData[index].fullName);
    }

    const message = `\n${formatedDate}\n№ группы ${groupName}\nПо списку: ${studentsVisitings.length}\nПрисутствует: ${visitCount}\nОтсутствуют по УП: ${respReason.join(' , ') || '—'}\nОтсутствуют: ${nonRespReason.join(' , ') || '—'}\nОтсутствуют ИП: ${IP.join(' , ') || '—'}
    `;

    return message;
  }
}
