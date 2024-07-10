import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Op } from 'sequelize';
import { ValidationErrorException } from 'src/exceptions/validation.exception';
import { BotService } from 'src/bot/bot.service';
import { log } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,

    private readonly botService: BotService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);

    this.botService.writeMessageToUser(
      user.tgId,
      'Вы успешно зарегистрировались! Ожидайте, когда вам выдадут роль',
    );

    return user;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    query: string = '',
    role: string[] | undefined = undefined,
  ) {
    log(role);
    const { count, rows } = await this.userRepository.findAndCountAll({
      limit: +limit,
      offset: (+page - 1) * +limit,
      where: {
        fullName: { [Op.like]: `%${query}%` },
        ...(role && { role }),
      },
      order: [['fullName', 'ASC']],
      attributes: ['id', 'username', 'fullName', 'role'],
    });
    return { count, data: rows };
  }

  async findOne(id: string) {
    const user = await this.findByPk(id);
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    };
  }

  async findOneByTgId(id: number) {
    const user = await this.userRepository.findOne({ where: { tgId: id } });
    return user;
  }

  async findByPk(id: string) {
    const user = await this.userRepository.findByPk(id, { raw: true });
    if (!user) throw new BadRequestException('user not found');
    return user;
  }

  async checkCandidateCurator(id: string | undefined = '') {
    //проверка на наличие куратора
    const candidateCurator = await this.userRepository.findOne({
      where: { id: id },
    });
    if (id) {
      if (!candidateCurator) throw new BadRequestException('curator not found');
      if (
        candidateCurator?.role !== 'none' &&
        candidateCurator?.role !== 'curator'
      )
        throw new ValidationErrorException(null, 'curator has other role');
    }
    return candidateCurator;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findByPk(id);

    if (
      user.role !== 'admin' &&
      user.role !== 'none' &&
      updateUserDto.role !== 'none'
    )
      throw new BadRequestException('user already has role');

    //изименение роли, если существующая роль "none" или "admin"
    if (user.role === 'none' || user.role == 'admin')
      user.role = updateUserDto.role || 'none';

    // user.role = updateUserDto.role || 'none';
    user.fullName = updateUserDto.fullName;
    await user.save();
    return;
  }

  async remove(id: string) {
    const user = await this.findByPk(id);
    await user.destroy();
    return;
  }

  async setRole(id: string, role: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');
    user.role = role;
    await user.save();
    return user;
  }

  async changeFullName(id: string, fullName: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('user not found');
    user.fullName = fullName;
    await user.save();
    return;
  }
}
