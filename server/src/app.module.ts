import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/entities/user.entity';
import { GroupsModule } from './groups/groups.module';
import { Group } from './groups/entities/group.entity';
import { Praepostor } from './groups/entities/praepostor.entity';
import { Student } from './groups/entities/student.entity';
import { VisitingsModule } from './visitings/visitings.module';
import { Visiting } from './visitings/entities/visiting.entity';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      models: [User, Group, Praepostor, Student, Visiting],
      autoLoadModels: true,
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
    }),
    UsersModule,
    AuthModule,
    GroupsModule,
    VisitingsModule,
    BotModule,
  ],
  controllers: [],
})
export class AppModule {}
