import React from "react";
import { ISummaryData } from "../../api/interfaces/IReportService.interface";
import styles from "./SummaryTable.module.css";
import sliceString from "../../utils/sliceString";
import classNames from "classnames";

interface ISummaryTableProps {
  data: ISummaryData;
}

const SummaryTable: React.FC<ISummaryTableProps> = ({ data }) => {
  return (
    <div className={styles["summary-table"]}>
      <div className={styles["fullName-list"]}>
        <div className={styles["fullName-item"]}>
          <p>-</p>
          <p>ФИО</p>
        </div>
        <SummaryFullNameList students={data.studentsVisitings} />
      </div>

      <div className={styles["students-visitings"]} style={{ gridTemplateColumns: `repeat(${data.dateData.days.length}, 20px)` }}>
        {data.dateData.days.map((day) => (
          <p key={day} className={styles["students-visitings-item"]}>
            {day}
          </p>
        ))}
        {Object.keys(data.studentsVisitings).map((key) => data.studentsVisitings[key].map((visit) => <VisitItem key={Math.random()} visit={visit} />))}
      </div>
    </div>
  );
};

interface ISummaryFullNameList {
  students: { [key: string]: string[] };
}

const SummaryFullNameList: React.FC<ISummaryFullNameList> = ({ students }) => {
  let index = 1;

  return (
    <ul className={styles["fullName-list"]}>
      {Object.keys(students).map((student) => (
        <li key={student} className={styles["fullName-item"]}>
          <p>{index++}</p>
          <p>{sliceString(student, 17)}</p>
        </li>
      ))}
    </ul>
  );
};

interface IVisitItem {
  visit: string;
}

const VisitItem: React.FC<IVisitItem> = ({ visit }) => {
  const classes = {
    УП: styles["visit-up"],
    Н: styles["visit-n"],
    О: styles["visit-o"],
  };
  return <p className={classNames([styles["students-visitings-item"], classes[visit as keyof typeof classes]])}>{visit === "--" ? "-" : visit}</p>;
};

export { SummaryTable };
