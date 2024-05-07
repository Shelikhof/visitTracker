import { AxiosResponse } from "axios";
import $api from ".";
import { IReportResponse, IReportStudent, ISummaryData } from "./interfaces/IReportService.interface";

export default class ReportService {
  static async getReport() {
    const response = await $api.get<IReportResponse>("/report");
    return response.data;
  }

  static async saveReport(students: IReportStudent[]) {
    const response = await $api.post("/report", { students });
    return response.data;
  }

  static async getSummaryFile(month: string, year: string): Promise<AxiosResponse<ArrayBuffer>> {
    const response = await $api.get("/summary", {
      params: {
        month,
        year,
      },
      responseType: "arraybuffer",
    });
    return response;
  }

  static async getSummaryData(month: string, year: string) {
    const response = await $api.get<ISummaryData>("/summaryData", {
      params: {
        month,
        year,
      },
    });
    return response.data;
  }
}
