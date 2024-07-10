import React from "react";
import { Button, Error, Input, PopUp, Switch } from "@/6_shared/ui";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IUserData, IUsersResponse } from "@/5_entities/user/IUserService.interface";
import UserService from "@/5_entities/user/UserService";
import { isAxiosError } from "axios";
import { ERRORS } from "@/6_shared/variables/errors";

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
      <div className="grid gap-[25px]">
        <Input setValue={setFullName} value={fullName} />
        <div className="flex">
          <p className="mr-8">Админ</p>
          <Switch onChange={() => setIsAdmin((prev) => !prev)} value={isAdmin} />
        </div>
        {error && <Error message={error} />}
        <div className="flex gap-3">
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
