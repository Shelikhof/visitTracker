interface IGroup {
  id: string;
  name: string;
}

export interface IGetGroupsResponse {
  count: number;
  data: IGroup[];
}

export interface IGetGroupByIdResponse {
  id: string;
  name: string;
  curator: {
    id: string;
    fullName: string;
  } | null;
}

export interface IGetGroupInfoResponse {
  id: string;
  name: string;
  isBudget: boolean;
  practiceMode: boolean;
  praepostors: IPraepostor[];
  students: IStudent[];
}

export interface ICurator {
  id: string;
  fullName: string;
}

export interface IPraepostor {
  id: string;
  fullName: string;
  username: string;
}

export interface IStudent {
  id: string;
  fullName: string;
  isIP: boolean;
  job: string | null;
}
