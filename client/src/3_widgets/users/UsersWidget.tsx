import { UsersList } from "@/4_features/users/UsersList";
import UserService from "@/5_entities/user/UserService";
import { Search } from "@/6_shared/ui/Search";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

const UsersWidget = () => {
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

  return (
    <div className="max-w-[550px] grid gap-8">
      <div className="max-w-[350px]">
        <Search onSearch={setSearchValue} placeholder="Введите пользователя" />
      </div>
      <UsersList query={query} />
    </div>
  );
};

export default UsersWidget;
