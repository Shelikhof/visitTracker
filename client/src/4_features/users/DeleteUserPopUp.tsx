import React from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IUserData, IUsersResponse } from "@/5_entities/user/IUserService.interface";
import UserService from "@/5_entities/user/UserService";
import { SubmitActionPopUp } from "@/6_shared/ui/SubmitActionPopUp";

interface IDeleteUserPopUpProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  user: IUserData | null;
  query: UseInfiniteQueryResult<InfiniteData<IUsersResponse, unknown>, Error>;
}

const DeleteUserPopUp: React.FC<IDeleteUserPopUpProps> = ({ isOpen, setIsOpen, user, query }) => {
  const handleDelete = async () => {
    await UserService.deleteUser(user?.id || "");
    query.refetch();
    setIsOpen(false);
  };

  return <SubmitActionPopUp isOpen={isOpen} setIsOpen={setIsOpen} message={`Удалить пользователя ${user?.fullName}?`} onSubmit={handleDelete} />;
};

export { DeleteUserPopUp };
