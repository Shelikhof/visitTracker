import React from "react";
import ReportService from "../../api/ReportService";
import { useQuery } from "@tanstack/react-query";
import { IReportStudent } from "../../api/interfaces/IReportService.interface";
import { Button, Checkbox, Select, Switch } from "../../UI";
import styles from "./Report.module.css";
import { dynamicSliceString } from "../../utils/sliceString";
import classNames from "classnames";
import useUserDataStore from "../../store/userData.store";
import { ISelectItem } from "../../interfaces/index.interface";

interface IReportProps {
  setDate: (date: Date) => void;
}

const Report: React.FC<IReportProps> = ({ setDate }) => {
  const [studentData, setStudentData] = React.useState<IReportStudent[]>([]);

  const groups = useUserDataStore((state) => state.userData?.groups);
  const [selectedGroup, setSelectedGroup] = React.useState(groups?.[0] || null);

  const { data, isFetching, refetch } = useQuery({
    queryKey: [`report-${selectedGroup?.id}`],
    queryFn: () => ReportService.getReport(selectedGroup?.id || ""),
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
        return { ...student, isVisit: !student.isVisit, isRespectfulReason: !student.isVisit ? null : true, isEat: !student.isVisit };
      }
      return student;
    });
    setStudentData(updatedStudentData);
  };

  const handleReasonCheckboxChange = (id: string) => {
    const updatedStudentData = studentData.map((student) => {
      if (student.id === id) {
        return { ...student, isRespectfulReason: !student.isRespectfulReason };
      }
      return student;
    });
    setStudentData(updatedStudentData);
  };

  const handleEatCheckboxChange = (id: string) => {
    const updatedStudentData = studentData.map((student) => {
      if (student.id === id) {
        return { ...student, isEat: !student.isEat };
      }
      return student;
    });
    setStudentData(updatedStudentData);
  };

  const handleSubmit = async () => {
    await ReportService.saveReport(studentData, selectedGroup?.id || "");
    refetch();
  };

  const changeGroup = (item: ISelectItem) => {
    setSelectedGroup(item);
    refetch();
  };

  return (
    <div className={styles["report"]}>
      {groups && groups?.length > 1 && <div className={styles["group-wrapper"]}>{selectedGroup && <Select onChange={changeGroup} value={selectedGroup} options={groups || []} />}</div>}
      <div className={styles["list"]}>
        <div className={classNames([styles["header"], styles["item"]])}>
          <div className={styles["fullName"]}>
            <p>ФИО</p>
            <p>Посещ.</p>
          </div>
          {Boolean(data?.isBudget) && <p>Ел</p>}
          <p>У/П</p>
        </div>
        {studentData.map((el) => (
          <ReportItem
            key={el.id}
            {...el}
            isBudget={Boolean(data?.isBudget)}
            onChangeVisit={() => handleSwitchChange(el.id)}
            onChangeReason={() => handleReasonCheckboxChange(el.id)}
            onChangeEat={() => handleEatCheckboxChange(el.id)}
          />
        ))}
      </div>
      <Button onClick={handleSubmit}>Сохранить</Button>
    </div>
  );
};

interface IReportItemProps extends IReportStudent {
  onChangeVisit: () => void;
  onChangeReason: () => void;
  onChangeEat: () => void;
  isBudget: boolean;
}
const ReportItem: React.FC<IReportItemProps> = ({ fullName, isVisit, onChangeVisit, isRespectfulReason, onChangeReason, isIP, isEat, onChangeEat, isBudget }) => {
  return (
    <div className={styles["item"]}>
      <label className={styles["fullName"]}>
        <div>
          <p>{dynamicSliceString(fullName)}</p>
          {isIP && <p className={styles["ip-flag"]}>ИП</p>}
        </div>
        <Switch onChange={onChangeVisit} value={isVisit} />
      </label>
      {isVisit && (isBudget ? <Checkbox value={isEat} onChange={onChangeEat} /> : <div></div>)}
      {!isVisit && isRespectfulReason !== null ? <Checkbox value={isRespectfulReason} onChange={onChangeReason} /> : <div></div>}
    </div>
  );
};

export { Report };
