import $api from ".";
import { IUserResponse, IUsersResponse, role } from "./interfaces/IUserService.interface";

export default class UserService {
  static async getAllUsers(page: number = 1, limit: number = 10, role: role[] | role | null = null, q: string = "") {
    const response = await $api.get<IUsersResponse>("/users/", {
      params: {
        page,
        limit,
        role,
        q,
      },
    });
    return response.data;
  }

  static async getUserById(id: string) {
    const response = await $api.get<IUserResponse>(`/users/${id}`);
    return response.data;
  }

  static async deleteUser(id: string) {
    const response = await $api.delete(`/users/${id}`);
    return response.data;
  }

  static async updateUser(id: string, fullName: string, role: role) {
    const response = await $api.patch(`/users/${id}`, { role, fullName });
    return response.data;
  }

  static async changeName(fullName: string) {
    const response = await $api.patch(`/users/changeName`, { fullName });
    return response;
  }
}
