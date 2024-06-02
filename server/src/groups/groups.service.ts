import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { EditGroupDto, UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './entities/group.entity';
import { ValidationErrorException } from 'src/exceptions/validation.exception';
import { Op } from 'sequelize';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Praepostor } from './entities/praepostor.entity';
import { Student } from './entities/student.entity';
import { BotService } from 'src/bot/bot.service';
import { log } from 'console';
import * as exceljs from 'exceljs';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group) private readonly groupRepository: typeof Group,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(Praepostor)
    private readonly praepostorRepository: typeof Praepostor,
    @InjectModel(Student) private readonly studentRepository: typeof Student,
    private readonly usersService: UsersService,
    private readonly botService: BotService,
  ) {}
  async create(createGroupDto: CreateGroupDto) {
    //проверка на наличие группы с таким названием
    await this.checkGroupName(createGroupDto.name);
    //проверка на наличие куратора
    const candidateCurator = await this.usersService.checkCandidateCurator(
      createGroupDto?.curatorId,
    );

    //создание группы
    const group = await this.groupRepository.create<Group>({
      name: createGroupDto.name,
      curatorId: createGroupDto?.curatorId || null,
    });

    //если куратора есть пользователь, то он становится куратором
    if (candidateCurator) {
      candidateCurator.role = 'curator';
      this.botService.writeMessageToUser(
        candidateCurator.dataValues.tgId,
        `Вам назначена роль куратора группы ${group.name}`,
      );
      await candidateCurator.save();
    }
    return;
  }

  async findAll(page: number = 1, limit: number = 10, query: string = '') {
    const { count, rows } = await this.groupRepository.findAndCountAll({
      limit: +limit,
      offset: (+page - 1) * +limit,
      where: {
        name: { [Op.like]: `%${query}%` },
      },
      order: [['name', 'ASC']],
      attributes: ['id', 'name'],
    });
    return { count, data: rows };
  }

  async findOne(id: string) {
    const group = await this.groupRepository.findOne({
      where: { id },
      include: [{ model: User, attributes: ['id', 'fullName'] }],
      attributes: ['id', 'name'],
    });

    if (!group) throw new BadRequestException('group not found');

    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) throw new BadRequestException('group not found');

    if (group.name !== updateGroupDto.name)
      await this.checkGroupName(updateGroupDto.name);

    const currentCurator = await this.userRepository.findOne({
      where: { id: group.curatorId },
    });

    //проверка на наличие куратора, если новый id куратора не совпадает с текущим у группы
    let candidateCurator;
    if (
      updateGroupDto?.curatorId &&
      currentCurator?.id !== updateGroupDto?.curatorId
    ) {
      candidateCurator = await this.usersService.checkCandidateCurator(
        updateGroupDto?.curatorId,
      );
    }

    //если куратора нет и добавляется новый
    if (!currentCurator && updateGroupDto?.curatorId) {
      candidateCurator.role = 'curator';
      group.curatorId = updateGroupDto?.curatorId;
      await candidateCurator.save();
    }

    //если куратор есть уже и он меняется на нового
    if (candidateCurator && currentCurator) {
      currentCurator.role = 'none';
      await currentCurator.save();

      candidateCurator.role = 'curator';
      await candidateCurator.save();
      group.curatorId = updateGroupDto?.curatorId;
    }

    //если куратор удален и у группы имеется куратор
    if (
      (updateGroupDto?.curatorId === '' && currentCurator) ||
      (updateGroupDto?.curatorId === undefined && currentCurator)
    ) {
      currentCurator.role = 'none';
      group.curatorId = null;
      await currentCurator.save();
    }

    if (candidateCurator)
      this.botService.writeMessageToUser(
        candidateCurator.dataValues.tgId,
        `Вам назначена роль куратора группы ${group.name}`,
      );

    group.name = updateGroupDto.name;
    await group.save();
    return;
  }

  async remove(id: string) {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) throw new BadRequestException('group not found');

    const curator = await this.userRepository.findOne({
      where: { id: group.curatorId },
    });

    //если куратор был, то его роль обнуляется
    if (curator) {
      curator.role = 'none';
      await curator.save();
    }

    //получение всех старост и обнуление их ролей
    const praepostors = await this.praepostorRepository.findAll({
      where: { groupId: group.id },
    });
    for (const praepostor of praepostors) {
      const user = await this.userRepository.findOne({
        where: { id: praepostor.userId },
      });
      if (!user) continue;

      user.role = 'none';
      await user.save();
    }

    await group.destroy();
    return;
  }

  async checkGroupName(name: string) {
    //проверка на наличие группы с таким названием
    const candidateGroup = await this.groupRepository.findOne({
      where: { name: name },
    });
    if (candidateGroup)
      throw new ValidationErrorException(null, 'group already exists');
  }

  //получить инфо о группе для куратора (студенты, название, старосты)
  async getInfo(groupId: string) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      include: [
        {
          model: User,
          attributes: ['id', 'fullName'],
          order: [['fullName', 'ASC']],
        },
      ],
      attributes: ['id', 'name', 'isBudget'],
    });
    if (!group) throw new BadRequestException('group not found');

    //получение студентов, отдельно, потому что вложенным запросом не работает сортировка в алфавитном порядке
    const students = await this.studentRepository.findAll({
      where: { groupId: group.dataValues.id },
      order: [['fullName', 'ASC']],
    });

    //получение старост, отдельно, потому что вложенным запросом не работает сортировка в алфавитном порядке
    const praepostors = await this.praepostorRepository.findAll({
      where: { groupId: group.dataValues.id },
      include: [{ model: User }],
    });

    //корректирование полей старост
    const formattedPraepostors = praepostors.map((praepostor) => {
      const { user } = praepostor;
      const { fullName, username, id } = user;
      return { id, fullName, username };
    });

    const data = {
      id: group.dataValues.id,
      name: group.dataValues.name,
      isBudget: group.dataValues.isBudget,
      students: students,
      praepostors: formattedPraepostors,
    };
    return data;
  }

  async editGroup(dto: EditGroupDto) {
    //проверка на наличие куратора
    // const curator = await this.usersService.findByPk(dto.userJwtData.id);
    // if (!curator) throw new BadRequestException('curator not found');

    //получение информации о группе
    const groupInfo = await this.getInfo(dto.groupId);
    if (!groupInfo) throw new BadRequestException('group not found');

    const group = await this.groupRepository.findByPk(groupInfo.id);

    const praepostorsDTO = dto.praepostors;
    const praepostorsGroup = groupInfo.praepostors;

    //получение данные, которые есть только в первом массиве, во втором и в обоих
    //если данные есть только в первом, то это новые данные
    //если данные есть только во втором, то это данные, которые надо удалить
    //если данные есть в обоих, то это данные, которые надо обновить

    const praepostorCompare = this.compareArrays(
      praepostorsDTO,
      praepostorsGroup,
    );

    //запись новых старост
    for (const praepostor of praepostorCompare.onlyInFirst) {
      const candidatePraepostor = await this.userRepository.findByPk(
        praepostor.id,
      );

      if (!candidatePraepostor) continue;

      candidatePraepostor.role = 'praepostor';
      this.botService.writeMessageToUser(
        candidatePraepostor.tgId,
        `Вам назначена роль старосты группы ${groupInfo.name}`,
      );
      await candidatePraepostor.save();

      const praepostorData = await this.praepostorRepository.create({
        groupId: groupInfo.id,
        userId: praepostor.id,
      });
    }

    //удаление старост
    for (const praepostor of praepostorCompare.onlyInSecond) {
      const candidatePraepostor = await this.userRepository.findByPk(
        praepostor.id,
      );

      if (!candidatePraepostor) continue;

      candidatePraepostor.role = 'none';
      await candidatePraepostor.save();

      const praepostorData = await this.praepostorRepository.findOne({
        where: { userId: praepostor.id },
      });
      await praepostorData.destroy();
    }

    if (dto.name) {
      group.name = dto.name;
      group.isBudget = dto.isBudget;
      await group.save();
    }

    const studentsDTO = dto.students;
    const studentsGroup = groupInfo.students;

    const studentsCompare = this.compareArrays(studentsDTO, studentsGroup);

    //запись новых студентов
    for (const student of studentsCompare.onlyInFirst) {
      const studentData = await this.studentRepository.create({
        groupId: groupInfo.id,
        fullName: student.fullName,
        isIP: student.isIP,
      });
    }

    //удаление студентов
    for (const student of studentsCompare.onlyInSecond) {
      const studentData = await this.studentRepository.findByPk(student.id);
      await studentData.destroy();
    }

    //обновление студентов
    for (const student of studentsCompare.intersection) {
      const studentData = await this.studentRepository.findByPk(student.id);
      studentData.isIP = student.isIP;
      studentData.fullName = student.fullName;
      await studentData.save();
    }
    return;
  }

  async addNewStudentsFromFile(file: Express.Multer.File, groupId: string) {
    const workbook = new exceljs.Workbook();

    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.getWorksheet(1);

    const studentsFromFile = [];

    for (let i = 2; i <= worksheet.rowCount; i++) {
      const student = worksheet.getCell(i, 1).value;
      studentsFromFile.push(student);
    }

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      raw: true,
    });
    if (!group) throw new BadRequestException('group not found');

    const students = await this.studentRepository.findAll({
      where: { groupId: group.id },
      raw: true,
    });

    if (students.length + studentsFromFile.length > 25)
      throw new BadRequestException('too many students');

    for (const student of studentsFromFile) {
      const newStudent = await this.studentRepository.create({
        groupId: group.id,
        fullName: student,
      });
    }

    return;
  }

  private compareArrays(arr1, arr2) {
    const intersection = arr1.filter((item1) =>
      arr2.some((item2) => item1.id === item2.id),
    );
    const onlyInFirst = arr1.filter(
      (item1) => !arr2.some((item2) => item1.id === item2.id),
    );
    const onlyInSecond = arr2.filter(
      (item2) => !arr1.some((item1) => item1.id === item2.id),
    );

    return {
      intersection,
      onlyInFirst,
      onlyInSecond,
    };
  }
}
