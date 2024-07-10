import $api from "../api";
import { IGetGroupByIdResponse, IGetGroupInfoResponse, IGetGroupsResponse, IPraepostor, IStudent } from "./IGroupService.interface";

export default class GroupService {
  static async getGroups(page: number = 1, limit: number = 10, q: string = "") {
    const response = await $api.get<IGetGroupsResponse>("/groups", {
      params: {
        page,
        limit,
        q,
      },
    });
    return response.data;
  }

  static async createGroup(name: string, curatorId: string | null = "") {
    const response = await $api.post("/groups/create", { name, curatorId });
    return response.data;
  }

  static async getGroupById(id: string) {
    const response = await $api.get<IGetGroupByIdResponse>(`/groups/${id}`);
    return response.data;
  }

  static async updateGroup(id: string, name: string, curatorId: string | null = "") {
    const response = await $api.patch(`/groups/${id}`, { name, curatorId });
    return response.data;
  }

  static async deleteGroup(id: string) {
    const response = await $api.delete(`/groups/${id}`);
    return response.data;
  }

  static async getGroupInfo(groupId: string) {
    const response = await $api.get<IGetGroupInfoResponse>("/groups/info/" + groupId);
    return response.data;
  }

  static async editGroupInfo(name: string, praepostors: IPraepostor[] | null = [], students: IStudent[] | null = [], groupId: string, isBudget: boolean, practiceMode: boolean) {
    const response = await $api.patch("/groups/edit", { name, praepostors, students, groupId, isBudget, practiceMode });
    return response.data;
  }

  static async uploadStudentFromFile(file: File, groupId: string) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await $api.post(`/groups/${groupId}/uploadFile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  }
}
