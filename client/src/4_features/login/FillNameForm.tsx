import React from "react";
import { Button, Input } from "@/6_shared/ui";
import AuthService from "@/5_entities/auth/AuthService";
import useRedirectOnDefaultPage from "@/6_shared/hooks/useRedirectOnDefaultPage";

import useTgDataStore from "@/5_entities/auth/tgData.store";
import useUserDataStore from "@/5_entities/user/userData.store";

const FillNameForm = () => {
  const [name, setName] = React.useState("");
  const tgData = useTgDataStore((state) => state.tgData);
  const { redirect, navigate } = useRedirectOnDefaultPage();
  const setUserData = useUserDataStore((state) => state.setUserData);
  const handleClick = async () => {
    if (!tgData) {
      navigate("/login");
      return;
    }
    try {
      const data = await AuthService.login(tgData, name);
      setUserData(data);
      redirect(data);
    } catch (error) {}
  };

  return (
    <div className="grid gap-4 w-[500px]">
      <Input setValue={setName} value={name} placeholder="Введите ФИО" />
      <Button onClick={handleClick} disabled={!name}>
        Подтвердить
      </Button>
    </div>
  );
};

export { FillNameForm };
