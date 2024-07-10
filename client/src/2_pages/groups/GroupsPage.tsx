import { Layout } from "@/6_shared/components";
import GroupsWidget from "@/3_widgets/groups/GroupsWidget";

const GroupsPage = () => {
  document.title = "Список групп";
  return (
    <Layout header="Список групп">
      <GroupsWidget />
    </Layout>
  );
};

export { GroupsPage };
