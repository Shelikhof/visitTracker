import React from "react";
import { Layout } from "../../components";
import { GroupHeader, GroupsList } from "../../widgets";
import styles from "./GroupsPage.module.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import GroupService from "../../api/GroupService";

const GroupsPage = () => {
  // const queryClient = new QueryClient();
  const [searchValue, setSearchValue] = React.useState("");
  const handleSearchChange = (searchValue: string) => {
    setSearchValue(searchValue);
    // queryClient.invalidateQueries({ queryKey: ["groups", searchValue] });
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
    <Layout header="Список групп">
      <div className={styles["groups-container"]}>
        <GroupHeader setSearchValue={handleSearchChange} query={query} />
        <GroupsList query={query} />
      </div>
    </Layout>
  );
};

export { GroupsPage };
