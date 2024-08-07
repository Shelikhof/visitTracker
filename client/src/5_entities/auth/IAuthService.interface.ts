import { IGroupItem } from "@/6_shared/interfaces/index.interface";
import { role } from "../user/IUserService.interface";

export interface IAuthResponse {
  fullName: string;
  username: string;
  role: role;
  groups: IGroupItem[];
}

export interface IAuthError {
  data: {
    tgId: number;
    username: string;
    fullname: null;
  };
  status: number;
  message: string;
}

export interface IUserData {
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  photo_url: string;
  username: string;
}

export interface IAuthRequest {
  userData: IUserData;
  fullName: string | null;
}
