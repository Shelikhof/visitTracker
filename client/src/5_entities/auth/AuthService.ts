import $api from "../api";
import { IAuthResponse, IUserData } from "./IAuthService.interface";

export default class AuthService {
  //логин
  static async login(userData: IUserData, fullName: string | null = null) {
    const response = await $api.post<IAuthResponse>("/auth/login", { userData, fullName });
    return response.data;
  }

  //обновление токена
  static async refresh() {
    const response = await $api.get<IAuthResponse>("/auth/refresh");
    return response.data;
  }

  //выход
  static async logout() {
    return $api.post("/auth/logout");
  }

  static async getMe() {
    const response = await $api.get<IAuthResponse>("/auth/me");
    return response.data;
  }
}
