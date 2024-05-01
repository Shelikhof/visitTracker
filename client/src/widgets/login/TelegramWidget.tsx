import TelegramLoginButton from "react-telegram-login";
import AuthService from "../../api/AuthService";
import { useNavigate } from "react-router-dom";
import useTgDataStore from "../../store/tgData.store";
import { ERRORS } from "../../variables/errors";
import useUserDataStore from "../../store/userData.store";
import { isAxiosError } from "axios";
import useRedirectOnDefaultPage from "../../hooks/useRedirectOnDefaultPage";
import { IUserData } from "../../api/interfaces/IAuthService.interface";

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
  return <TelegramLoginButton dataOnauth={handleTelegramResponse} botName="chydila1337bot" lang="ru" />;
};

export { TelegramWidget };
