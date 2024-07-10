import { GroupHeader } from "@/4_features/groups/GroupHeader";
import { GroupsList } from "@/4_features/groups/GroupsList";
import GroupService from "@/5_entities/group/GroupService";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

const GroupsWidget = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
  };

  const LIMIT = 100;
  const fetchData = async ({ pageParam = 0 }) => {
    return GroupService.getGroups(pageParam, LIMIT, searchValue);
  };

  const query = useInfiniteQuery({
    queryKey: ["groups", searchValue],
    queryFn: fetchData,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length * LIMIT < lastPage.count ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  return (
    <div className="max-w-[650px] grid gap-8">
      <GroupHeader setSearchValue={handleSearchChange} query={query} />
      <GroupsList query={query} />
    </div>
  );
};

export default GroupsWidget;
