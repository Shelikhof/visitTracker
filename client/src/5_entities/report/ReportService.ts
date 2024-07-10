import { AxiosResponse } from "axios";
import $api from "../api";
import { IReportResponse, IReportStudent, ISummaryData } from "./IReportService.interface";

export default class ReportService {
  static async getReport(groupId: string) {
    const response = await $api.get<IReportResponse>("/report/" + groupId);
    return response.data;
  }

  static async saveReport(students: IReportStudent[], groupId: string) {
    const response = await $api.post("/report", { students, groupId });
    return response.data;
  }

  static async getSummaryFile(month: string, year: string, type: string, groupId: string): Promise<AxiosResponse<ArrayBuffer>> {
    const response = await $api.get("/summary", {
      params: {
        month,
        year,
        type,
        groupId,
      },
      responseType: "arraybuffer",
    });
    return response;
  }

  static async getSummaryData(month: string, year: string, type: string, groupId: string) {
    const response = await $api.get<ISummaryData>("/summaryData", {
      params: {
        month,
        year,
        type,
        groupId,
      },
    });
    return response.data;
  }
}
