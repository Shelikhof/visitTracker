import { useQuery } from "@tanstack/react-query";
import GroupService from "../../api/GroupService";
import { Layout } from "../../components";
import React from "react";
import { IPraepostor, IStudent } from "../../api/interfaces/IGroupService.interface";
import { Button, Checkbox, Input, Select } from "../../UI";
import { PraepostorsList, StudentsList } from "../../widgets";
import styles from "./GroupPage.module.css";
import useUserDataStore from "../../store/userData.store";
import { ISelectItem } from "../../interfaces/index.interface";
import useSelectedGroupInfoStore from "../../store/selectedGroupInfo.store";

const GroupPage = () => {
  const groups = useUserDataStore((state) => state.userData?.groups);
  const setGroup = useSelectedGroupInfoStore((state) => state.setGroup);
  const [selectedGroup, setSelectedGroup] = React.useState(groups?.[0] || null);

  const { data, refetch, isFetching } = useQuery({
    queryKey: [`group-${selectedGroup?.id}`],
    queryFn: () => GroupService.getGroupInfo(selectedGroup?.id || ""),
  });

  const [groupName, setGroupName] = React.useState("");
  const [praepostors, setPraepostors] = React.useState<IPraepostor[] | null>(null);
  const [students, setStudents] = React.useState<IStudent[] | null>(null);
  const [isBudget, setIsBudget] = React.useState(true);

  React.useEffect(() => {
    setGroupName(data?.name || "");
    setPraepostors(data?.praepostors || null);
    setStudents(data?.students || null);
    setIsBudget(Boolean(data?.isBudget));
  }, [isFetching]);

  const changeGroup = async (item: ISelectItem) => {
    setSelectedGroup(item);
    setGroup(item);
    refetch();
  };

  const saveGroup = async () => {
    await GroupService.editGroupInfo(groupName, praepostors, students, selectedGroup?.id || "", isBudget);
    refetch();
  };

  document.title = `Группа ${data?.name || ""}`;
  return (
    <Layout header={`Группа ${data?.name || ""}`}>
      {groups && groups?.length > 1 && <div className={styles["group-wrapper"]}>{selectedGroup && <Select onChange={changeGroup} value={selectedGroup} options={groups || []} />}</div>}
      <div className={styles["group-wrapper"]}>
        <div className={styles["left-side"]}>
          <div className={styles["group-name"]}>
            <Input value={groupName} setValue={setGroupName} placeholder="Название группы" />
            <label className={styles["checkbox-wrapper"]}>
              <span>Бюджетная группа</span> <Checkbox value={isBudget} onChange={() => setIsBudget(!isBudget)} />
            </label>
          </div>
          <PraepostorsList praepostors={praepostors || []} setPraepostors={setPraepostors} />
        </div>
        <StudentsList students={students || []} setStudents={setStudents} refetch={refetch} />
      </div>
      <div className={styles["save-button"]}>
        <Button onClick={saveGroup} disabled={groupName ? false : true}>
          Сохранить группу
        </Button>
      </div>
    </Layout>
  );
};

export { GroupPage };
