import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import React from "react";

import { IGetGroupsResponse } from "@/5_entities/group/IGroupService.interface";
import sliceString from "@/6_shared/utils/sliceString";
import { GroupPopUp } from "./GroupPopUp";
import { InfinityScroll } from "@/6_shared/components";

interface IGroupsListProps {
  query: UseInfiniteQueryResult<InfiniteData<IGetGroupsResponse, unknown>, Error>;
}

const GroupsList: React.FC<IGroupsListProps> = ({ query }) => {
  const [isOpenPopUp, setIsOpenPopUp] = React.useState(false);
  const [currentGroupId, setCurrentGroupId] = React.useState("");

  const handleClick = (id: string) => {
    setCurrentGroupId(id);
    setIsOpenPopUp(true);
  };

  return (
    <>
      <GroupPopUp isOpen={isOpenPopUp} setIsOpen={setIsOpenPopUp} groupId={currentGroupId} query={query} />
      <InfinityScroll fetchData={query.fetchNextPage} isOver={!query.hasNextPage} isLoading={query.isLoading}>
        {query.data && (
          <ul className="grid sm:grid-cols-4 sm:gap-y-8 sm:gap-x-6 gap-4 grid-cols-2">
            {query.data.pages.map((page) => {
              return page.data.map((group) => {
                return <GroupItem key={group.id} name={group.name} onClick={() => handleClick(group.id)} />;
              });
            })}
          </ul>
        )}
      </InfinityScroll>
    </>
  );
};

interface IGroupItemProps {
  name: string;
  onClick: () => void;
}

const GroupItem: React.FC<IGroupItemProps> = ({ name, onClick }) => {
  return (
    <li onClick={onClick} className="p-4 border-2 border-solid border-gray-100 rounded-2xl cursor-pointer text-center transition-all hover:border-gray-300">
      <p>{sliceString(name, 10)}</p>
    </li>
  );
};

export { GroupsList };
