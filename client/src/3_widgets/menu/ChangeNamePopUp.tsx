import React from "react";
import { Button, Input, PopUp } from "@/6_shared/ui";

import UserService from "@/5_entities/user/UserService";
import useUserDataStore from "@/5_entities/user/userData.store";

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
    setIsOpen(false);
  };

  return (
    <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title="Изменить ФИО">
      <Input setValue={setFullName} value={fullName} />
      <div className="flex gap-3 mt-[25px]">
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
