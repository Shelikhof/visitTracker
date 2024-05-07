import React from "react";
import ReportService from "../../api/ReportService";
import { useQuery } from "@tanstack/react-query";
import { IReportStudent } from "../../api/interfaces/IReportService.interface";
import { Button, Checkbox, Switch } from "../../UI";
import styles from "./Report.module.css";
import { dynamicSliceString } from "../../utils/sliceString";
import classNames from "classnames";

interface IReportProps {
  setDate: (date: Date) => void;
}

const Report: React.FC<IReportProps> = ({ setDate }) => {
  const [studentData, setStudentData] = React.useState<IReportStudent[]>([]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["report"],
    queryFn: () => ReportService.getReport(),
  });

  React.useEffect(() => {
    if (data) {
      setStudentData(data.students);
      setDate(new Date(data.date));
    }
  }, [data, isFetching]);

  const handleSwitchChange = (id: string) => {
    const updatedStudentData = studentData.map((student) => {
      if (student.id === id) {
        return { ...student, isVisit: !student.isVisit, isRespectfulReason: !student.isVisit ? null : true };
      }
      return student;
    });
    setStudentData(updatedStudentData);
  };

  const handleCheckboxChange = (id: string) => {
    const updatedStudentData = studentData.map((student) => {
      if (student.id === id) {
        return { ...student, isRespectfulReason: !student.isRespectfulReason };
      }
      return student;
    });
    setStudentData(updatedStudentData);
  };

  const handleSubmit = async () => {
    await ReportService.saveReport(studentData);
    refetch();
  };

  return (
    <div className={styles["report"]}>
      <div className={styles["list"]}>
        <div className={classNames([styles["header"], styles["item"]])}>
          <p>ФИО</p>
          <p>Посещ.</p>
          <p>У/П</p>
        </div>
        {studentData.map((el) => (
          <ReportItem key={el.id} {...el} onChangeVisit={() => handleSwitchChange(el.id)} onChangeReason={() => handleCheckboxChange(el.id)} />
        ))}
      </div>
      <Button onClick={handleSubmit}>Сохранить</Button>
    </div>
  );
};

interface IReportItemProps extends IReportStudent {
  onChangeVisit: () => void;
  onChangeReason: () => void;
}
const ReportItem: React.FC<IReportItemProps> = ({ fullName, isVisit, onChangeVisit, isRespectfulReason, onChangeReason, isIP }) => {
  return (
    <div className={styles["item"]}>
      <div>
        <p>{dynamicSliceString(fullName)}</p>
        {isIP && <p className={styles["ip-flag"]}>ИП</p>}
      </div>
      <Switch onChange={onChangeVisit} value={isVisit} />
      {!isVisit && isRespectfulReason !== null && <Checkbox value={isRespectfulReason} onChange={onChangeReason} />}
    </div>
  );
};

export { Report };
