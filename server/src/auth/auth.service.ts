import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LogInDto } from './dto/login.dto';
import { ValidationErrorException } from 'src/exceptions/validation.exception';
import { TokenService } from './token.service';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from 'src/groups/entities/group.entity';
import { Praepostor } from 'src/groups/entities/praepostor.entity';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Group) private readonly groupRepository: typeof Group,
    @InjectModel(Praepostor)
    private readonly praepostorRepository: typeof Praepostor,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}
  async logIn(logInDto: LogInDto) {
    //проверка, есть ли пользователь с таким tgId, если есть, то возвращаем токены
    const candidateUser = await this.usersService.findOneByTgId(
      logInDto.userData.id,
    );
    let userGroup = null;
    if (candidateUser?.role === 'curator')
      userGroup = await this.getGroups(candidateUser.id, candidateUser.role);
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
          groups: userGroup,
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
    const user = await this.usersService.findOne(id);
    let userGroup = null;
    if (user.role === 'curator' || user.role === 'praepostor')
      userGroup = await this.getGroups(user.id, user.role);
    return {
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      groups: userGroup,
    };
  }

  private async getGroups(id: string, role: string) {
    log(id, role);
    let groups = null;
    if (role === 'curator') {
      groups = await this.groupRepository.findAll({
        where: { curatorId: id },
        attributes: ['id', 'name'],
        raw: true,
      });
    }

    if (role === 'praepostor') {
      const praepostor = await this.praepostorRepository.findOne({
        where: { userId: id },
        raw: true,
      });

      log(praepostor.groupId);

      groups = await this.groupRepository.findAll({
        where: { id: praepostor.groupId },
        attributes: ['id', 'name'],
        raw: true,
      });
    }

    groups.forEach((group) => {
      group['value'] = group.name;
      delete group.name;
    });

    return groups;
  }
}
