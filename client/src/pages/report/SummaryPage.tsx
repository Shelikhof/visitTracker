import React from "react";
import { Layout } from "../../components";
import { Summary, SummaryTable } from "../../widgets";
import useSummaryParamsStore from "../../store/summaryParams.store";
import ReportService from "../../api/ReportService";
import { ISummaryData } from "../../api/interfaces/IReportService.interface";
import styles from "./SummaryPage.module.css";

const SummaryPage = () => {
  const month = useSummaryParamsStore((state) => state.month);
  const year = useSummaryParamsStore((state) => state.year);
  const type = useSummaryParamsStore((state) => state.type);
  const groupId = useSummaryParamsStore((state) => state.groupId);

  const [summaryData, setSummaryData] = React.useState<ISummaryData | null>(null);

  const fetchSummaryData = async () => {
    if (!month || !year || !type || !groupId) return;
    const data = await ReportService.getSummaryData(month, year, type, groupId);
    setSummaryData(data);
  };

  React.useEffect(() => {
    fetchSummaryData();
  }, [month, year, type, groupId]);

  document.title = "Сводка за месяц";
  return (
    <Layout header="Сводка за месяц">
      <Summary />
      <div className={styles["table"]}>{summaryData && <SummaryTable data={summaryData} />}</div>
    </Layout>
  );
};

export { SummaryPage };
