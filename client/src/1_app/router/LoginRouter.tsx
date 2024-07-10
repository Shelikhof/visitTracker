import { FillNamePage, LogInPage } from "@/2_pages";
import { Route, Routes } from "react-router-dom";

const LoginRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LogInPage />} />
      <Route path="/fillName" element={<FillNamePage />} />
    </Routes>
  );
};

export default LoginRouter;
