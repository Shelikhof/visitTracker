import React from "react";
import { Button, Search } from "../../UI";
import styles from "./GroupHeader.module.css";
import { GroupPopUp } from "./GroupPopUp";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IGetGroupsResponse } from "../../api/interfaces/IGroupService.interface";

interface IGroupHeaderProps {
  setSearchValue: (value: string) => void;
  query: UseInfiniteQueryResult<InfiniteData<IGetGroupsResponse, unknown>, Error>;
}

const GroupHeader: React.FC<IGroupHeaderProps> = ({ setSearchValue, query }) => {
  const [isOpenPopUp, setIsOpenPopUp] = React.useState(false);
  const handleClick = () => {
    setIsOpenPopUp(true);
  };
  return (
    <div className={styles["group-header"]}>
      <GroupPopUp isOpen={isOpenPopUp} setIsOpen={setIsOpenPopUp} query={query} />
      <Search onSearch={setSearchValue} placeholder="Введите группу" />
      <Button onClick={handleClick}>Добавить группу</Button>
    </div>
  );
};

export { GroupHeader };
