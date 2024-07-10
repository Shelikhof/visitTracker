import React from "react";
import { Button, Search } from "@/6_shared/ui";
import { GroupPopUp } from "./GroupPopUp";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IGetGroupsResponse } from "@/5_entities/group/IGroupService.interface";

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
    <div className="grid sm:grid-cols-55-35 justify-between gap-4 grid-cols-1">
      <GroupPopUp isOpen={isOpenPopUp} setIsOpen={setIsOpenPopUp} query={query} />
      <Search onSearch={setSearchValue} placeholder="Введите группу" />
      <Button onClick={handleClick}>Добавить группу</Button>
    </div>
  );
};

export { GroupHeader };
