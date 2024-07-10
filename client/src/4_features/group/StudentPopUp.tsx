import React from "react";
import { IStudent } from "@/5_entities/group/IGroupService.interface";
import { Button, Input, PopUp, Switch } from "@/6_shared/ui";

interface IStudentPopUpProps {
  student?: IStudent | null;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSubmit: (value: IStudent) => void;
}

const StudentPopUp: React.FC<IStudentPopUpProps> = ({ isOpen, setIsOpen, student, onSubmit }) => {
  const [data, setData] = React.useState<IStudent>({
    fullName: "",
    id: "",
    isIP: false,
    job: null,
  });

  React.useEffect(() => {
    setData(
      student || {
        fullName: "",
        id: "",
        isIP: false,
        job: null,
      }
    );
  }, [isOpen === true]);

  const closePopUp = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    onSubmit(data);
    closePopUp();
  };

  return (
    <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title={student ? "Редактировать студента" : "Добавить студента"}>
      <div className="grid gap-6">
        <Input placeholder="ФИО" value={data.fullName} setValue={(value) => setData({ ...data, fullName: value })} />
        {data.isIP && <Input placeholder="Место работы" value={data.job || ""} setValue={(value) => setData({ ...data, job: value })} />}
        <div className="flex gap-8 items-center">
          <p>Является ИП</p>
          <Switch onChange={() => setData((prev) => ({ ...data, isIP: !prev.isIP }))} value={data.isIP} />
        </div>
        <div className="flex gap-3">
          <Button variant="gray" onClick={closePopUp}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!data.fullName}>
            Подтвердить
          </Button>
        </div>
      </div>
    </PopUp>
  );
};

export { StudentPopUp };
