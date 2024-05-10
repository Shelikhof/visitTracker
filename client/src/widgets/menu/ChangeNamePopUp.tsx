import React from "react";
import { Button, Input, PopUp } from "../../UI";
import useUserDataStore from "../../store/userData.store";
import UserService from "../../api/UserService";
import styles from "./ChangeNamePopUp.module.css";

interface IChangeNamePopUpProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ChangeNamePopUp: React.FC<IChangeNamePopUpProps> = ({ isOpen, setIsOpen }) => {
  const [fullName, setFullName] = React.useState("");
  const storeFullName = useUserDataStore((state) => state.userData?.fullName);

  React.useEffect(() => {
    setFullName(storeFullName || "");
  }, [storeFullName]);

  const handleSubmit = async () => {
    await UserService.changeName(fullName);
  };

  return (
    <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title="Изменить ФИО">
      <Input setValue={setFullName} value={fullName} />
      <div className={styles["buttons"]}>
        <Button variant="gray" onClick={() => setIsOpen(false)}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} disabled={!fullName}>
          Подтвердить
        </Button>
      </div>
    </PopUp>
  );
};

export { ChangeNamePopUp };
