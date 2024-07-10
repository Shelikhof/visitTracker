import React from "react";

import useSummaryParamsStore from "@/5_entities/report/summaryParams.store";

import { MONTH } from "@/6_shared/variables/month";
import { SUMMARY_TYPES } from "@/6_shared/variables/summaryTypes";
import ReportService from "@/5_entities/report/ReportService";
import { Button, Select } from "@/6_shared/ui";
import useUserDataStore from "@/5_entities/user/userData.store";

interface ISelectItem {
  id: string;
  value: string;
}

const SummaryHeader = () => {
  const setSummaryParams = useSummaryParamsStore((state) => state.setSummaryParams);
  const groups = useUserDataStore((state) => state.userData?.groups);

  const date = new Date();
  const YEARS = [
    { id: String(date.getFullYear() - 1), value: String(date.getFullYear() - 1) },
    { id: String(date.getFullYear()), value: String(date.getFullYear()) },
    { id: String(date.getFullYear()) + 1, value: String(date.getFullYear() + 1) },
  ];
  const [month, setMonth] = React.useState<ISelectItem>(MONTH[date.getMonth()]);
  const [year, setYear] = React.useState<ISelectItem>(YEARS[1]);
  const [summaryType, setSummaryType] = React.useState<ISelectItem>(SUMMARY_TYPES[0]);
  const [selectedGroup, setSelectedGroup] = React.useState(groups?.[0] || null);

  React.useEffect(() => {
    setSummaryParams(month.id, year.id, summaryType.id, selectedGroup?.id || "");
  }, [month, year, summaryType, selectedGroup]);

  const handleClick = async () => {
    const buffer = await ReportService.getSummaryFile(month.id, year.id, summaryType.id, selectedGroup?.id || "");
    const blob = new Blob([buffer.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    // a.style = "display: none";
    a.href = url;
    if (summaryType.id === "visitings") a.download = `Выгрузка посещаемости за ${month.value} ${year.value}.xlsx`;
    if (summaryType.id === "eatings") a.download = `Выгрузка питания за ${month.value} ${year.value}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1000px] md:flex gap-4 grid grid-cols-2">
      {groups && groups?.length > 1 && selectedGroup && <Select options={groups || []} onChange={setSelectedGroup} value={selectedGroup} />}
      <Select options={SUMMARY_TYPES} onChange={setSummaryType} value={summaryType} />
      <Select options={MONTH} onChange={setMonth} value={month} />
      <Select options={YEARS} onChange={setYear} value={year} />
      <Button onClick={handleClick}>Выгрузить в Excel</Button>
    </div>
  );
};

export { SummaryHeader };
