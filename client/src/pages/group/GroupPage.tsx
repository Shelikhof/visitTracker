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

  const praep = [
    {
      id: "1",
      fullName: "Иванов Иван Иванович",
      username: "username",
    },
    {
      id: "2",
      fullName: "не вано",
      username: "username",
    },
  ];

  const studen = [
    {
      id: "1",
      fullName: "Иванов1 Иван1 Иванович1",
      isIP: true,
    },
    {
      id: "2",
      fullName: "Иванов2 Иван2 Иванович2",
      isIP: false,
    },
    {
      id: "3",
      fullName: "Иванов3 Иван3 Иванович3",
      isIP: false,
    },
    {
      id: "4",
      fullName: "Иванов4 Иван4 Иванович4",
      isIP: true,
    },
    {
      id: "5",
      fullName: "Иванов5 Иван5 Иванович5",
      isIP: false,
    },
  ];

  React.useEffect(() => {
    setGroupName(data?.name || "");
    setPraepostors(data?.praepostors || null);
    // setPraepostors(praep);
    setStudents(data?.students || null);
    // setStudents(studen);
  }, [isFetching]);

  const saveGroup = async () => {
    const data = await GroupService.editGroupInfo(groupName, praepostors, students);
    refetch();
  };

  return (
    <Layout header={`Группа ${data?.name || ""}`}>
      <div className={styles["group-wrapper"]}>
        <div className={styles["left-side"]}>
          <Input value={groupName} setValue={setGroupName} placeholder="Название группы" />
          <PraepostorsList praepostors={praepostors || []} setPraepostors={setPraepostors} />
        </div>
        <StudentsList students={students || []} setStudents={setStudents} />
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
