import { JwtData } from 'src/auth/interface/jwt-data.interface';

export class ChangeNameDto {
  fullName: string;
  userJwtData: JwtData;
}
