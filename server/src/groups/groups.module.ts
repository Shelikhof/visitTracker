import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { Praepostor } from './entities/praepostor.entity';
import { Student } from './entities/student.entity';
import { BotModule } from 'src/bot/bot.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Group, User, Praepostor, Student]),
    UsersModule,
    AuthModule,
    BotModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
