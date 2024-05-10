import React from "react";
import { Button, Error, Input, PopUp, Switch } from "../../UI";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IUserData, IUsersResponse } from "../../api/interfaces/IUserService.interface";
import UserService from "../../api/UserService";
import styles from "./EditUserPopUp.module.css";
import { isAxiosError } from "axios";
import { ERRORS } from "../../variables/errors";

interface IEditUserPopUpProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  user: IUserData | null;
  query: UseInfiniteQueryResult<InfiniteData<IUsersResponse, unknown>, Error>;
}

const EditUserPopUp: React.FC<IEditUserPopUpProps> = ({ isOpen, setIsOpen, user, query }) => {
  const [fullName, setFullName] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setFullName(user?.fullName || "");
    setIsAdmin(user?.role === "admin");
    setError("");
  }, [user]);

  const handleSubmit = async () => {
    try {
      await UserService.updateUser(user?.id || "", fullName, isAdmin ? "admin" : "none");
      query.refetch();
      setIsOpen(false);
    } catch (error) {
      if (isAxiosError(error) && error.response?.data.message === ERRORS.USER_ALERDY_HAS_ROLE) setError("Пользователь уже имеет другую роль");
    }
  };

  return (
    <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title="Изменение пользователя">
      <div className={styles["form"]}>
        <Input setValue={setFullName} value={fullName} />
        <div className={styles["role"]}>
          <p>Админ</p>
          <Switch onChange={() => setIsAdmin((prev) => !prev)} value={isAdmin} />
        </div>
        {error && <Error message={error} />}
        <div className={styles["buttons"]}>
          <Button variant="gray" onClick={() => setIsOpen(false)}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>Подтвердить</Button>
        </div>
      </div>
    </PopUp>
  );
};

export { EditUserPopUp };
