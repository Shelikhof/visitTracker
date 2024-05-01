export class LogInDto {
  userData: {
    id: number | null;
    username: string;
    hash: string;
  };
  fullName: string | null;
}
