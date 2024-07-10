import React from "react";

import { ISummaryData } from "@/5_entities/report/IReportService.interface";
import sliceString from "@/6_shared/utils/sliceString";
import { cn } from "@/6_shared/utils/utils";

interface ISummaryTableProps {
  data: ISummaryData;
}

const SummaryTable: React.FC<ISummaryTableProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-auto-auto gap-[10px]">
      <div className="grid gap-[10px]">
        <div className="grid grid-cols-20px-200px">
          <p>-</p>
          <p>ФИО</p>
        </div>
        <SummaryFullNameList students={data.studentsVisitings} />
      </div>

      <div className="grid overflow-x-auto gap-[10px]" style={{ gridTemplateColumns: `repeat(${data.dateData.days.length}, 20px)` }}>
        {data.dateData.days.map((day) => (
          <p key={day} className="w-full justify-self-center text-center">
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
    <ul className="grid gap-[10px]">
      {Object.keys(students).map((student) => (
        <li key={student} className="grid grid-cols-20px-200px">
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
    УП: "",
    Н: "text-white bg-red-500",
    О: "",
  };
  return <p className={cn("w-full justify-self-center text-center", classes[visit as keyof typeof classes])}>{visit === "--" ? "-" : visit}</p>;
};

export { SummaryTable };
