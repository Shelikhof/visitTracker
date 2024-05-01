export class CreateVisitingDto {
  students: IVisitingStudent[];
  userJwtData: {
    id: string;
    role: string;
  };
}

export interface IVisitingStudent {
  id: string;
  fullName: string;
  isVisit: boolean;
}
