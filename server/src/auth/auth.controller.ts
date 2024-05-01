import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { Request, Response } from 'express';
import checkSignature from './checkSignature';
import { TokenGuard } from './token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async logIn(@Res() response: Response, @Body() LogInDto: LogInDto) {
    const userData = LogInDto.userData;

    //проверка на наличие хэша от телеграма
    if (!userData.hash) {
      return response.sendStatus(400);
    }

    //проверка подлинности хэша
    if (!checkSignature(process.env.BOT_TOKEN, userData)) {
      return response.sendStatus(400);
    }

    ///получение токенов, запись токенов в куки
    const res = await this.authService.logIn(LogInDto);
    response.cookie('refreshToken', res.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 3600 * 1000,
    });
    response.cookie('accessToken', res.tokens.accessToken, {
      maxAge: 3600 * 1000,
    });

    return response.send(res.userData);
  }

  @Get('/refresh')
  async refreshTokens(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies?.refreshToken;

    //обновление токенов и запись в куки
    const tokens = await this.authService.refreshTokens(refreshToken);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 3600 * 1000,
    });
    response.cookie('accessToken', tokens.accessToken, {
      maxAge: 3600 * 1000,
    });
    return response.sendStatus(200);
  }

  @Post('/logout')
  async logOut(@Req() request: Request, @Res() response: Response) {
    //удаление токенов из куки
    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
    return response.sendStatus(200);
  }

  //получение данных о пользователе
  @UseGuards(TokenGuard)
  @Get('/me')
  getMe(@Body() body: any) {
    return this.authService.getMe(body.userJwtData.id);
  }
}
