import React from "react";

import AuthService from "@/5_entities/auth/AuthService";
import { useNavigate } from "react-router-dom";
import "./css/index.css";
import AppRouter from "./router";
import { IAuthResponse } from "@/5_entities/auth/IAuthService.interface";
import useUserDataStore from "@/5_entities/user/userData.store";

function App() {
  const navigate = useNavigate();
  const setUserData = useUserDataStore((state) => state.setUserData);
  const [isLoading, setIsLoading] = React.useState(true);

  const setData = (data: IAuthResponse) => {
    setUserData(data);
  };

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
  if (isLoading) return <p>{/* Здесь сделать красивый какой нибудь загрузчик */}</p>;
  return <AppRouter />;
}

export default App;
