import React from "react";
import { Button, Select } from "../../UI";
import { MONTH } from "../../variables/month";
import styles from "./Summary.module.css";
import ReportService from "../../api/ReportService";

interface ISelectItem {
  id: string;
  value: string;
}

const Summary = () => {
  const date = new Date();
  const YEARS = [
    { id: String(date.getFullYear() - 1), value: String(date.getFullYear() - 1) },
    { id: String(date.getFullYear()), value: String(date.getFullYear()) },
    { id: String(date.getFullYear()) + 1, value: String(date.getFullYear() + 1) },
  ];
  const [month, setMonth] = React.useState<ISelectItem>(MONTH[date.getMonth()]);
  const [year, setYear] = React.useState<ISelectItem>(YEARS[1]);

  const handleClick = async () => {
    const buffer = await ReportService.getSummary(month.id, year.id);
    const blob = new Blob([buffer.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    // a.style = "display: none";
    a.href = url;
    a.download = `Выгрузка посещаемости за ${month.value} ${year.value}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={styles["summary"]}>
      <div className={styles["selects"]}>
        <Select options={MONTH} onChange={setMonth} value={month} />
        <Select options={YEARS} onChange={setYear} value={year} />
      </div>
      <Button onClick={handleClick}>Выгрузить в excel</Button>
    </div>
  );
};

export { Summary };
