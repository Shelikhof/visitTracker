import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidationErrorException } from 'src/exceptions/validation.exception';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  //генерация токенов
  generateToken(payload: any) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
    });

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
    });

    return { refreshToken, accessToken };
  }

  //валидация токенов
  validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.TOKEN_SECRET,
      });
    } catch (error) {
      throw new ValidationErrorException(null, 'token is expired');
    }
  }
}
