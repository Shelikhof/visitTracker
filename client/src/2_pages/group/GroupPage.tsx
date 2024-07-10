import { useQuery } from "@tanstack/react-query";
import GroupService from "@/5_entities/group/GroupService";
import React from "react";
import { IPraepostor, IStudent } from "@/5_entities/group/IGroupService.interface";
import { Button, Checkbox, Input, Select } from "@/6_shared/ui";
import { PraepostorsList, StudentsList } from "@/3_widgets";
import { ISelectItem } from "@/6_shared/interfaces/index.interface";
import useSelectedGroupInfoStore from "@/5_entities/group/selectedGroupInfo.store";
import { Layout } from "@/6_shared/components";
import useUserDataStore from "@/5_entities/user/userData.store";

const GroupPage = () => {
  const groups = useUserDataStore((state) => state.userData?.groups);
  const setGroup = useSelectedGroupInfoStore((state) => state.setGroup);
  const [selectedGroup, setSelectedGroup] = React.useState(groups?.[0] || null);

  const { data, refetch, isFetching } = useQuery({
    queryKey: [`group`, selectedGroup?.id],
    queryFn: () => GroupService.getGroupInfo(selectedGroup?.id || ""),
  });

  const [groupName, setGroupName] = React.useState("");
  const [praepostors, setPraepostors] = React.useState<IPraepostor[] | null>(null);
  const [students, setStudents] = React.useState<IStudent[] | null>(null);
  const [isBudget, setIsBudget] = React.useState(true);
  const [practiceMode, setPracticeMode] = React.useState(true);

  React.useEffect(() => {
    setGroupName(data?.name || "");
    setPraepostors(data?.praepostors || null);
    setStudents(data?.students || null);
    setIsBudget(Boolean(data?.isBudget));
    setPracticeMode(Boolean(data?.practiceMode));
  }, [isFetching]);

  const changeGroup = async (item: ISelectItem) => {
    setSelectedGroup(item);
    setGroup(item);
    refetch();
  };

  const saveGroup = async () => {
    await GroupService.editGroupInfo(groupName, praepostors, students, selectedGroup?.id || "", isBudget, practiceMode);
    refetch();
  };

  document.title = `Группа ${data?.name || ""}`;
  return (
    <Layout header={`Группа ${data?.name || ""}`}>
      {groups && groups?.length > 1 && (
        <div className="grid md:grid-cols-group-grid grid-cols-1 mb-8">{selectedGroup && <Select onChange={changeGroup} value={selectedGroup} options={groups || []} />}</div>
      )}
      <div className="grid justify-between gap-[50px] mb-[50px] md:grid-cols-group-grid grid-cols-1">
        <div className="flex flex-col gap-8">
          <div className="grid gap-3">
            <Input value={groupName} setValue={setGroupName} placeholder="Название группы" />
            <label className="flex gap-3 justify-between">
              <span>Бюджетная группа</span> <Checkbox value={isBudget} onChange={() => setIsBudget(!isBudget)} />
            </label>
            <label className="flex gap-3 justify-between">
              <span>Группа на практике</span> <Checkbox value={practiceMode} onChange={() => setPracticeMode(!practiceMode)} />
            </label>
          </div>
          <PraepostorsList praepostors={praepostors || []} setPraepostors={setPraepostors} />
        </div>
        <StudentsList students={students || []} setStudents={setStudents} refetch={refetch} />
      </div>
      <div className="max-w-[500px] mx-auto">
        <Button onClick={saveGroup} disabled={groupName ? false : true}>
          Сохранить группу
        </Button>
      </div>
    </Layout>
  );
};

export { GroupPage };
