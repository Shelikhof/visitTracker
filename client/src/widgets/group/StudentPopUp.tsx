import React from "react";
import { IStudent } from "../../api/interfaces/IGroupService.interface";
import { Button, Input, PopUp, Switch } from "../../UI";
import styles from "./StudentPopUp.module.css";

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
  });

  React.useEffect(() => {
    setData(
      student || {
        fullName: "",
        id: "",
        isIP: false,
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
      <div className={styles["form"]}>
        <Input placeholder="ФИО" value={data.fullName} setValue={(value) => setData({ ...data, fullName: value })} />
        <div className={styles["IP"]}>
          <p>Является ИП</p>
          <Switch onChange={() => setData((prev) => ({ ...data, isIP: !prev.isIP }))} value={data.isIP} />
        </div>
        <div className={styles["buttons"]}>
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
