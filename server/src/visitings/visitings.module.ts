import { Module } from '@nestjs/common';
import { VisitingsService } from './visitings.service';
import { VisitingsController } from './visitings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Visiting } from './entities/visiting.entity';
import { Group } from 'src/groups/entities/group.entity';
import { User } from 'src/users/entities/user.entity';
import { Praepostor } from 'src/groups/entities/praepostor.entity';
import { Student } from 'src/groups/entities/student.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BotModule } from 'src/bot/bot.module';

@Module({
  controllers: [VisitingsController],
  providers: [VisitingsService],
  imports: [
    SequelizeModule.forFeature([Visiting, Group, User, Praepostor, Student]),
    AuthModule,
    BotModule,
  ],
  exports: [VisitingsService],
})
export class VisitingsModule {}
