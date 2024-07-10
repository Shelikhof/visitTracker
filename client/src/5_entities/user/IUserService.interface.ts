export interface IUsersResponse {
  count: number;
  data: IUserData[];
}

export interface IUserData {
  id: string;
  username: string;
  fullName: string;
  role: role;
}

export type role = "admin" | "curator" | "none" | "praepostor";

export interface IUserResponse {
  id: string;
  username: string;
  fullName: string;
  role: role;
}
