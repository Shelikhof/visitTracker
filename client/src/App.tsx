import React from "react";
import AppRouter from "./router";
import useUserDataStore from "./store/userData.store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import AuthService from "./api/AuthService";
import { useNavigate } from "react-router-dom";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchIntervalInBackground: false,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  const navigate = useNavigate();
  const setUserData = useUserDataStore((state) => state.setUserData);
  const userData = useUserDataStore((state) => state.userData);
  const [isLoading, setIsLoading] = React.useState(true);

  const setData = (data: any) => {
    setUserData({ role: data?.role, username: data?.username, fullName: data?.fullName });
  };

  const fetchData = async () => {
    try {
      const data = await AuthService.getMe();
      if (data.role) setData(data);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      navigate("/login");
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {isLoading ? <p>{/* Здесь сделать красивый какой нибудь загрузчик */}</p> : <AppRouter />}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
