import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { log } from 'console';
import { BotService } from 'src/bot/bot.service';
import { GroupsService } from 'src/groups/groups.service';
import { UsersService } from 'src/users/users.service';
import { VisitingsService } from 'src/visitings/visitings.service';

@Injectable()
export class CronService {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly visitingsService: VisitingsService,
    private readonly usersService: UsersService,
    private readonly botService: BotService,
  ) {}

  @Cron('0 30 10 * * *', {
    name: 'sendNotification',
    timeZone: 'Europe/Moscow',
  })
  async sendNotification() {
    try {
      const isSendMessg = await this.isWorkingDay();
      if (!isSendMessg) return;

      const { count } = await this.groupsService.findAll(1, 1);
      const { data } = await this.groupsService.findAll(1, count);

      for (const group of data) {
        const hasReport = await this.visitingsService.hasReportToday(group.id);
        log('hasReport ' + hasReport);
        if (hasReport) continue;

        const isPracticeMode = await this.groupsService.isPracticeMode(
          group.id,
        );
        log('isPracticeMode ' + isPracticeMode);
        if (isPracticeMode) continue;

        const praepostors = await this.groupsService.getPraepostors(group.id);

        for (const praepostor of praepostors) {
          const user = await this.usersService.findByPk(praepostor.userId);
          log(praepostor.userId);
          await this.botService.writeMessageToUserWithLinkButton(
            user.tgId,
            `Напоминание сдать отчёт о посещаемости группы ${group.name}\nhttp://127.0.0.1/report`,
            'http://127.0.0.1/report',
            'Отправить отчёт',
          );
        }
      }
      log('send notification');
    } catch (error) {
      log(error);
    }
  }

  private async isWorkingDay(): Promise<boolean> {
    const res = await axios.get('https://isdayoff.ru/today?tz=Europe/Moscow');
    // const res = await axios.get('https://isdayoff.ru/20240713');
    return !res.data;
    // return true;
  }
}
