import { Navigate, Route, Routes } from "react-router-dom";
import { DevPage, GroupPage, GroupsPage, NotFoundPage, ReportPage, SummaryPage, UsersPage } from "@/2_pages";
import LoginRouter from "./LoginRouter";

import roleValidator from "@/6_shared/utils/roleValidator";
import REDIRECT from "@/6_shared/variables/redirectAfterLogin";
import useUserDataStore from "@/5_entities/user/userData.store";

const AppRouter = () => {
  const userData = useUserDataStore((state) => state.userData);

  return (
    <Routes>
      <Route path="/dev" element={<DevPage />} />
      <Route path="/login/*" element={<LoginRouter />} />
      <Route path="/users" element={roleValidator(userData?.role || "none", ["admin"], <UsersPage />, <Navigate to={REDIRECT[userData?.role || "none"]} />)} />
      <Route path="/groups" element={roleValidator(userData?.role || "none", ["admin"], <GroupsPage />, <Navigate to={REDIRECT[userData?.role || "none"]} />)} />
      <Route path="/group" element={roleValidator(userData?.role || "none", ["curator"], <GroupPage />, <Navigate to={REDIRECT[userData?.role || "none"]} />)} />
      <Route path="/report" element={roleValidator(userData?.role || "none", ["curator", "praepostor"], <ReportPage />, <Navigate to={REDIRECT[userData?.role || "none"]} />)} />
      <Route path="/summary" element={roleValidator(userData?.role || "none", ["curator", "praepostor"], <SummaryPage />, <Navigate to={REDIRECT[userData?.role || "none"]} />)} />
      <Route path="/404" element={roleValidator(userData?.role || "none", ["none"], <NotFoundPage />, <Navigate to={REDIRECT[userData?.role || "none"]} />)} />
      <Route path="*" element={<Navigate to={REDIRECT[userData?.role || "none"]} />} />
    </Routes>
  );
};

export default AppRouter;
