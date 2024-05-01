import React from "react";
import ReportService from "../../api/ReportService";
import { useQuery } from "@tanstack/react-query";
import { IReportStudent } from "../../api/interfaces/IReportService.interface";
import { Button, Switch } from "../../UI";
import styles from "./Report.module.css";
import { dynamicSliceString } from "../../utils/sliceString";

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
        return { ...student, isVisit: !student.isVisit };
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
        {studentData.map((el) => (
          <ReportItem key={el.id} {...el} onChange={() => handleSwitchChange(el.id)} />
        ))}
      </div>
      <Button onClick={handleSubmit}>Сохранить</Button>
    </div>
  );
};

interface IReportItemProps extends IReportStudent {
  onChange: () => void;
}
const ReportItem: React.FC<IReportItemProps> = ({ fullName, isVisit, onChange }) => {
  return (
    <div className={styles["item"]}>
      <p>{dynamicSliceString(fullName)}</p>
      <Switch onChange={onChange} value={isVisit} />
    </div>
  );
};

export { Report };
