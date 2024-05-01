export interface ICreateSummary {
  dateData: DateData;
  studentsVisitings: IStudentVisitings;
  group: {
    name: string;
    curator: string;
  };
}

export interface IStudentVisitings {
  [studentName: string]: (boolean | string)[];
}

interface DateData {
  month: string;
  year: string;
  firstDay: Date;
  lastDay: Date;
  dayCount: number;
  days: number[];
}
