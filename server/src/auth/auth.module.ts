import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from 'src/groups/entities/group.entity';
import { Praepostor } from 'src/groups/entities/praepostor.entity';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule,
    SequelizeModule.forFeature([Group, Praepostor]),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
