export interface IReportResponse {
  date: Date;
  students: IReportStudent[];
}

export interface IReportStudent {
  id: string;
  fullName: string;
  isVisit: boolean;
}
