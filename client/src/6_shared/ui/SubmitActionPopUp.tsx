import React from "react";

import { PopUp } from "./PopUp";
import { Button } from "./Button";

interface ISumbitActionPopUpProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  message: string;
  onSubmit: () => void;
}

const SubmitActionPopUp: React.FC<ISumbitActionPopUpProps> = ({ isOpen, message, onSubmit, setIsOpen }) => {
  const handleSubmit = () => {
    onSubmit();
    setIsOpen(false);
  };

  return (
    <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title="Подтвердите действие">
      <p>{message}</p>
      <div className="flex gap-3 mt-[30px]">
        <Button variant="gray" onClick={() => setIsOpen(false)}>
          Отмена
        </Button>
        <Button variant="red" onClick={handleSubmit}>
          Подтвердить
        </Button>
      </div>
    </PopUp>
  );
};

export { SubmitActionPopUp };
