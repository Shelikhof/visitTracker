import { useInfiniteQuery } from "@tanstack/react-query";
import UserService from "../../api/UserService";
import { Layout } from "../../components";
import React from "react";
import { UsersList } from "../../widgets";
import { Search } from "../../UI";
import styles from "./UsersPage.module.css";

const UsersPage = () => {
  const [searchValue, setSearchValue] = React.useState("");

  const fetchData = async ({ pageParam = 0 }) => {
    return UserService.getAllUsers(pageParam, LIMIT, null, searchValue);
  };

  const LIMIT = 50;
  const query = useInfiniteQuery({
    queryKey: ["users", searchValue],
    queryFn: fetchData,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length * LIMIT < lastPage.count ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  document.title = "Список пользователей";
  return (
    <Layout header="Список пользователей">
      <div className={styles["users-container"]}>
        <div className={styles["users-search"]}>
          <Search onSearch={setSearchValue} placeholder="Введите пользователя" />
        </div>
        <UsersList query={query} />
      </div>
    </Layout>
  );
};

export { UsersPage };
