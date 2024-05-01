import React from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IUserData, IUsersResponse } from "../../api/interfaces/IUserService.interface";
import UserService from "../../api/UserService";
import { SubmitActionPopUp } from "../SubmitActionPopUp";

interface IDeleteUserPopUpProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  user: IUserData | null;
  query: UseInfiniteQueryResult<InfiniteData<IUsersResponse, unknown>, Error>;
}

const DeleteUserPopUp: React.FC<IDeleteUserPopUpProps> = ({ isOpen, setIsOpen, user, query }) => {
  const handleDelete = async () => {
    const data = await UserService.deleteUser(user?.id || "");
    query.refetch();
    setIsOpen(false);
  };

  return <SubmitActionPopUp isOpen={isOpen} setIsOpen={setIsOpen} message={`Удалить пользователя ${user?.fullName}?`} onSubmit={handleDelete} />;
};

export { DeleteUserPopUp };
