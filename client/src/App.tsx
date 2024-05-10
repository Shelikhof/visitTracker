import React from "react";
import AppRouter from "./router";
import useUserDataStore from "./store/userData.store";
import AuthService from "./api/AuthService";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const setUserData = useUserDataStore((state) => state.setUserData);
  const [isLoading, setIsLoading] = React.useState(true);

  const setData = (data: any) => {
    setUserData({ role: data?.role, username: data?.username, fullName: data?.fullName });
  };

  // const { data, error, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => AuthService.getMe() });

  const fetchData = async () => {
    try {
      await AuthService.refresh();
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

  return <>{isLoading ? <p>{/* Здесь сделать красивый какой нибудь загрузчик */}</p> : <AppRouter />}</>;
}

export default App;
