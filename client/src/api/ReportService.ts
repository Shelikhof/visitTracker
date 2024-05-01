import { AxiosResponse } from "axios";
import $api from ".";
import { IReportResponse, IReportStudent } from "./interfaces/IReportService.interface";

export default class ReportService {
  static async getReport() {
    const response = await $api.get<IReportResponse>("/report");
    return response.data;
  }

  static async saveReport(students: IReportStudent[]) {
    const response = await $api.post("/report", { students });
    return response.data;
  }

  static async getSummary(month: string, year: string): Promise<AxiosResponse<ArrayBuffer>> {
    const response = await $api.get("/summary", {
      params: {
        month,
        year,
      },
      responseType: "arraybuffer",
    });
    return response;
  }
}
