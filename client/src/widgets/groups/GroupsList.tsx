import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import React from "react";
import { InfinityScroll } from "../../components";
import { IGetGroupsResponse } from "../../api/interfaces/IGroupService.interface";
import styles from "./GroupsList.module.css";
import sliceString from "../../utils/sliceString";
import { GroupPopUp } from "./GroupPopUp";

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
          <ul className={styles["groups-list"]}>
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
    <li onClick={onClick} className={styles["group-item"]}>
      <p>{sliceString(name, 10)}</p>
    </li>
  );
};

export { GroupsList };
