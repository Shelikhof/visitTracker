import { useNavigate } from "react-router-dom";
import REDIRECT from "../variables/redirectAfterLogin";
import { IUserData } from "@/5_entities/auth/userData.store";

const useRedirectOnDefaultPage = () => {
  const navigate = useNavigate();

  const redirect = (userData: IUserData | null) => {
    navigate(REDIRECT[(userData?.role as keyof typeof REDIRECT) || "none"]);
  };

  return { redirect, navigate };
};

export default useRedirectOnDefaultPage;
