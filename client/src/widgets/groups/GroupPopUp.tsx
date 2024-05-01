import React, { useState } from "react";
import { Button, Input, PopUp, SearchDebounce, Error } from "../../UI";
import UserService from "../../api/UserService";
import styles from "./GroupPopUp.module.css";
import GroupService from "../../api/GroupService";
import { isAxiosError } from "axios";
import { ERRORS } from "../../variables/errors";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IGetGroupsResponse } from "../../api/interfaces/IGroupService.interface";

interface IGroupPopUpProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  groupId?: string;
  query: UseInfiniteQueryResult<InfiniteData<IGetGroupsResponse, unknown>, Error>;
}

const GroupPopUp: React.FC<IGroupPopUpProps> = ({ isOpen, setIsOpen, groupId, query }) => {
  const [error, setError] = React.useState("");
  const [formData, setFormData] = React.useState({
    name: "",
    curatorId: "",
    curatorName: "",
  });

  //получить пользователей без роли по поиску
  const fetchData = async (value: string) => {
    const data = await UserService.getAllUsers(1, 10, "none", value);
    return data.data;
  };

  //закрыть попап, сбросить данные, перезапросить данные
  const closePopUp = () => {
    setFormData({
      name: "",
      curatorId: "",
      curatorName: "",
    });
    setError("");
    setIsOpen(false);
    query.refetch();
  };

  //подтвердить форму, если groupId существует, то сохранить, иначе создать новую группу
  const onSubmit = async () => {
    try {
      if (groupId) {
        const data = await GroupService.updateGroup(groupId, formData.name, formData.curatorId);
      } else {
        const data = await GroupService.createGroup(formData.name, formData.curatorId);
      }
      closePopUp();
    } catch (error) {
      if (isAxiosError(error) && error.response?.data.error === ERRORS.GROUP_ALREADY_EXISTS) setError("Группа с таким названием уже существует");
    }
  };

  //получить данннеы группы
  const fetchGroup = async (id: string) => {
    const data = await GroupService.getGroupById(id);
    setFormData({
      name: data.name,
      curatorId: data?.curator?.id || "",
      curatorName: data?.curator?.fullName || "",
    });
  };

  //получить данные группы при открытии
  React.useEffect(() => {
    if (groupId && isOpen) {
      fetchGroup(groupId);
    }
  }, [isOpen]);

  //обработка нажатия кнопки удаления
  const handleDelete = async () => {
    if (!groupId) return;
    if (error !== "Повторно нажмите кнопку удаления") {
      setError("Повторно нажмите кнопку удаления");
      return;
    }
    await GroupService.deleteGroup(groupId);
    closePopUp();
  };

  return (
    <PopUp isOpen={isOpen} setIsOpen={closePopUp} title={groupId ? "Редактирование группы" : "Добавление группы"}>
      <div className={styles["form"]}>
        <Input value={formData.name} setValue={(setValue) => setFormData({ ...formData, name: setValue })} placeholder="Название" />
        <SearchDebounce
          fetchData={fetchData}
          onClick={(value) => setFormData({ ...formData, curatorId: value?.id || "", curatorName: value?.fullName || "" })}
          placeholder="Куратор"
          defaultValue={formData.curatorName}
        />
        {error && <Error message={error} />}
        <div className={styles["buttons"]}>
          {groupId && (
            <Button onClick={handleDelete} variant="red">
              Удалить
            </Button>
          )}
          <Button onClick={closePopUp} variant="gray">
            Отмена
          </Button>
          <Button onClick={onSubmit} disabled={formData.name ? false : true}>
            Подтвердить
          </Button>
        </div>
      </div>
    </PopUp>
  );
};

export { GroupPopUp };
