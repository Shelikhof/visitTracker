import { Route, Routes } from "react-router-dom";
import { FillNamePage, LogInPage } from "../pages";

const LoginRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LogInPage />} />
      <Route path="/fillName" element={<FillNamePage />} />
    </Routes>
  );
};

export default LoginRouter;
