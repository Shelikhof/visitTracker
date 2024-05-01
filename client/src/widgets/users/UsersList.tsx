import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import React from "react";
import { IUserData, IUsersResponse } from "../../api/interfaces/IUserService.interface";
import { InfinityScroll } from "../../components";
import styles from "./UsersList.module.css";
import ROLE from "../../variables/role";
import { dynamicSliceString } from "../../utils/sliceString";
import { DeleteUserPopUp } from "./DeleteUserPopUp";
import { EditUserPopUp } from "./EditUserPopUp";

interface IUsersListProps {
  query: UseInfiniteQueryResult<InfiniteData<IUsersResponse, unknown>, Error>;
}

const UsersList: React.FC<IUsersListProps> = ({ query }) => {
  const [isOpenDeleteUserPopUp, setIsOpenDeleteUserPopUp] = React.useState(false);
  const [isOpenEditUserPopUp, setIsOpenEditUserPopUp] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<IUserData | null>(null);

  const handleDeleteClick = (user: IUserData) => {
    setCurrentUser(user);
    setIsOpenDeleteUserPopUp(true);
  };

  const handleUserClick = (user: IUserData) => {
    setCurrentUser(user);
    setIsOpenEditUserPopUp(true);
  };

  return (
    <>
      <DeleteUserPopUp isOpen={isOpenDeleteUserPopUp} setIsOpen={setIsOpenDeleteUserPopUp} user={currentUser} query={query} />
      <EditUserPopUp isOpen={isOpenEditUserPopUp} setIsOpen={setIsOpenEditUserPopUp} user={currentUser} query={query} />
      <InfinityScroll fetchData={query.fetchNextPage} isOver={!query.hasNextPage} isLoading={query.isLoading}>
        {query.data && (
          <ul className={styles["users-list"]}>
            {query.data.pages.map((page) => {
              return page.data.map((user) => {
                return <UserItem key={user.id} userData={user} handleDeleteClick={() => handleDeleteClick(user)} handleUserClick={() => handleUserClick(user)} />;
              });
            })}
          </ul>
        )}
      </InfinityScroll>
    </>
  );
};

interface IUserItemProps {
  userData: IUserData;
  handleDeleteClick: () => void;
  handleUserClick: () => void;
}

const UserItem: React.FC<IUserItemProps> = ({ userData, handleDeleteClick, handleUserClick }) => {
  return (
    <li className={styles["user-item"]}>
      <div className={styles["user-info"]} onClick={handleUserClick}>
        <p>{dynamicSliceString(userData.fullName)}</p>
        <p className={styles["username"]}>@{userData.username}</p>
      </div>
      <p className={styles["role"]}>{ROLE[userData.role]}</p>
      <button className={styles["delete-button"]} onClick={handleDeleteClick}>
        <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 2V0H14V2H0Z" fill="#000F22" />
        </svg>
      </button>
    </li>
  );
};

export { UsersList };
