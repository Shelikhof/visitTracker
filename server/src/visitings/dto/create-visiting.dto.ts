export class CreateVisitingDto {
  groupId: string;
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
  isRespectfulReason: boolean | null;
  isIP: boolean;
  isEat: boolean | null;
}
