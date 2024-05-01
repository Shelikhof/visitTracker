import React from "react";
import styles from "./FillNameForm.module.css";
import { Button, Input } from "../../UI";
import useTgDataStore from "../../store/tgData.store";
import AuthService from "../../api/AuthService";
import useRedirectOnDefaultPage from "../../hooks/useRedirectOnDefaultPage";

const FillNameForm = () => {
  const [name, setName] = React.useState("");
  const tgData = useTgDataStore((state) => state.tgData);
  const { redirect, navigate } = useRedirectOnDefaultPage();
  const handleClick = async () => {
    if (!tgData) {
      navigate("/login");
      return;
    }
    try {
      const data = await AuthService.login(tgData, name);
      redirect();
    } catch (error) {}
  };

  return (
    <div className={styles["wrapper"]}>
      <Input setValue={setName} value={name} placeholder="Введите ФИО" />
      <Button onClick={handleClick} disabled={!name}>
        Подтвердить
      </Button>
    </div>
  );
};

export { FillNameForm };
