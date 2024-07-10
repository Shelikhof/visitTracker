import TelegramLoginButton from "react-telegram-login";
import AuthService from "@/5_entities/auth/AuthService";
import { useNavigate } from "react-router-dom";

import { ERRORS } from "@/6_shared/variables/errors";

import { isAxiosError } from "axios";
import useRedirectOnDefaultPage from "@/6_shared/hooks/useRedirectOnDefaultPage";

import useTgDataStore from "@/5_entities/auth/tgData.store";
import { IUserData } from "@/5_entities/auth/IAuthService.interface";
import useUserDataStore from "@/5_entities/user/userData.store";

const TelegramWidget = () => {
  const setTgData = useTgDataStore((state) => state.setTgData);
  const setUserData = useUserDataStore((state) => state.setUserData);
  const navigate = useNavigate();
  const { redirect } = useRedirectOnDefaultPage();

  const handleTelegramResponse = async (user: IUserData) => {
    try {
      const data = await AuthService.login(user);
      setUserData(data);
      redirect(data);
    } catch (error: any) {
      if (isAxiosError(error) && error.response && error.response.data.error === ERRORS.USER_HASNT_FULLNAME) {
        setTgData(error.response.data.data);
        navigate("/login/fillName");
      }
    }
  };
  return <TelegramLoginButton dataOnauth={handleTelegramResponse} botName={import.meta.env.VITE_BOT_NAME} lang="ru" />;
};

export { TelegramWidget };
