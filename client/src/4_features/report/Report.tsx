import React from "react";

import { useQuery } from "@tanstack/react-query";
import { IReportStudent } from "@/5_entities/report/IReportService.interface";

import ReportService from "@/5_entities/report/ReportService";
import { ISelectItem } from "@/6_shared/interfaces/index.interface";
import { Button, Checkbox, Select, Switch } from "@/6_shared/ui";
import { dynamicSliceString } from "@/6_shared/utils/sliceString";
import useUserDataStore from "@/5_entities/user/userData.store";

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
        return { ...student, isVisit: !student.isVisit, isRespectfulReason: !student.isVisit ? null : true, isEat: student.isEat === null ? null : !student.isVisit };
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
    <div className="max-w-[450px] mx-auto grid gap-8">
      <div>
        {groups && groups?.length > 1 && selectedGroup && <Select onChange={changeGroup} value={selectedGroup} options={groups || []} />}
        {data?.practiceMode && <p className="font-bold text-center text-lg mt-2">Группа на практике</p>}
      </div>
      <div className="grid gap-5">
        <div className="grid grid-cols-4-1-1 items-start">
          <div className="grid grid-cols-4-1">
            <p className="font-bold" title="ФИО студента">
              ФИО
            </p>
            <p className="font-bold" title="Присутствие в колледже">
              Посещ.
            </p>
          </div>
          {Boolean(data?.isBudget) && Boolean(!data?.practiceMode) && (
            <p className="font-bold flex justify-center" title="Посещение обеда">
              Обед
            </p>
          )}
          <p className="font-bold flex justify-center" title="Уважительная причина">
            УВ
          </p>
        </div>
        {studentData.map((el) => (
          <ReportItem
            key={el.id}
            {...el}
            isBudget={Boolean(data?.isBudget)}
            practiceMode={Boolean(data?.practiceMode)}
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
  practiceMode: boolean;
}
const ReportItem: React.FC<IReportItemProps> = ({ fullName, isVisit, onChangeVisit, isRespectfulReason, onChangeReason, isIP, isEat, onChangeEat, isBudget, practiceMode }) => {
  return (
    <div className="grid grid-cols-4-1-1 items-start">
      <label className="grid grid-cols-4-1">
        <div>
          <p>{dynamicSliceString(fullName)}</p>
          {isIP && <p className="text-xs text-gray-300">ИП</p>}
        </div>
        <Switch onChange={onChangeVisit} value={isVisit} />
      </label>
      {isBudget &&
        !practiceMode &&
        (isVisit ? (
          <div className="flex justify-center">
            <Checkbox value={!!isEat} onChange={onChangeEat} />
          </div>
        ) : (
          <div></div>
        ))}
      {!isVisit && isRespectfulReason !== null ? (
        <div className="flex justify-center">
          <Checkbox value={isRespectfulReason} onChange={onChangeReason} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export { Report };
