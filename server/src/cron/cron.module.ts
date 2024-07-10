import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { GroupsModule } from 'src/groups/groups.module';
import { UsersModule } from 'src/users/users.module';
import { VisitingsModule } from 'src/visitings/visitings.module';
import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [GroupsModule, UsersModule, VisitingsModule, BotModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
