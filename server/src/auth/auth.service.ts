import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LogInDto } from './dto/login.dto';
import { ValidationErrorException } from 'src/exceptions/validation.exception';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}
  async logIn(logInDto: LogInDto) {
    //проверка, есть ли пользователь с таким tgId, если есть, то возвращаем токены
    const candidateUser = await this.usersService.findOneByTgId(
      logInDto.userData.id,
    );
    if (candidateUser) {
      return {
        tokens: this.tokenService.generateToken({
          id: candidateUser.id,
          role: candidateUser.role,
        }),
        userData: {
          username: candidateUser.username,
          role: candidateUser.role,
          fullName: candidateUser.fullName,
        },
      };
    }

    //если в дто нет ФИО, то выкидываем ошибку
    if (!logInDto.fullName) {
      throw new ValidationErrorException(logInDto, 'fullName is required');
    }

    //создание пользователя
    const user = await this.usersService.create({
      fullName: logInDto.fullName,
      tgId: logInDto.userData.id,
      username: logInDto.userData.username,
    });
    return {
      tokens: this.tokenService.generateToken({ id: user.id, role: user.role }),
      userData: {
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    //если нет refreshToken, то выкидываем ошибку
    if (!refreshToken) {
      throw new ValidationErrorException(null, 'refreshToken is required');
    }

    //проверка подлинности refreshToken
    const payload = this.tokenService.validateToken(refreshToken);
    if (!payload) {
      throw new ValidationErrorException(null, 'refreshToken is invalid');
    }

    //получение данных пользователя и генерация токенов
    const user = await this.usersService.findByPk(payload.id);
    if (!user) {
      throw new ValidationErrorException(null, 'user not found');
    }

    return this.tokenService.generateToken({ id: user.id, role: user.role });
  }

  //получение данных пользователя по токену
  async getMe(id: string) {
    const user = await this.usersService.findByPk(id);
    return {
      role: user.role,
      username: user.username,
      fullName: user.fullName,
    };
  }
}
