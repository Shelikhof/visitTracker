import { SummaryHeader } from "@/4_features/summary/SummaryHeader";
import { SummaryTable } from "@/4_features/summary/SummaryTable";
import { ISummaryData } from "@/5_entities/report/IReportService.interface";
import ReportService from "@/5_entities/report/ReportService";
import useSummaryParamsStore from "@/5_entities/report/summaryParams.store";
import React from "react";

const SummaryWidget = () => {
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

  return (
    <>
      <SummaryHeader />
      <div className="mt-8">{summaryData && <SummaryTable data={summaryData} />}</div>
    </>
  );
};

export default SummaryWidget;
