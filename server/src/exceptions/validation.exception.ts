import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationErrorException extends HttpException {
  constructor(data: any, error: string) {
    super(
      { data, status: HttpStatus.BAD_REQUEST, error },
      HttpStatus.BAD_REQUEST,
    );
  }
}
