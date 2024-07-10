export interface IReportResponse {
  isBudget: boolean;
  practiceMode: boolean;
  date: Date;
  students: IReportStudent[];
}

export interface IReportStudent {
  id: string;
  fullName: string;
  isIP: boolean;
  isVisit: boolean;
  isEat: boolean | null;
  isRespectfulReason: boolean | null;
}

export interface ISummaryData {
  dateData: {
    dayCount: number;
    days: number[];
    firstDay: Date;
    lastDay: Date;
    month: string;
    year: string;
  };
  group: {
    name: string;
    curator: string;
  };
  studentsVisitings: { [key: string]: string[] };
}
