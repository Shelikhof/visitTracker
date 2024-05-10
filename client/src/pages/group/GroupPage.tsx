import { useQuery } from "@tanstack/react-query";
import GroupService from "../../api/GroupService";
import { Layout } from "../../components";
import React from "react";
import { IPraepostor, IStudent } from "../../api/interfaces/IGroupService.interface";
import { Button, Input } from "../../UI";
import { PraepostorsList, StudentsList } from "../../widgets";
import styles from "./GroupPage.module.css";

const GroupPage = () => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["group-info"],
    queryFn: () => GroupService.getGroupInfo(),
  });

  const [groupName, setGroupName] = React.useState("");
  const [praepostors, setPraepostors] = React.useState<IPraepostor[] | null>(null);
  const [students, setStudents] = React.useState<IStudent[] | null>(null);

  React.useEffect(() => {
    setGroupName(data?.name || "");
    setPraepostors(data?.praepostors || null);
    setStudents(data?.students || null);
  }, [isFetching]);

  const saveGroup = async () => {
    await GroupService.editGroupInfo(groupName, praepostors, students);
    refetch();
  };

  document.title = `Группа ${data?.name || ""}`;
  return (
    <Layout header={`Группа ${data?.name || ""}`}>
      <div className={styles["group-wrapper"]}>
        <div className={styles["left-side"]}>
          <Input value={groupName} setValue={setGroupName} placeholder="Название группы" />
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
