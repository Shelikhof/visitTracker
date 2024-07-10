import UsersWidget from "@/3_widgets/users/UsersWidget";
import { Layout } from "@/6_shared/components";

const UsersPage = () => {
  document.title = "Список пользователей";
  return (
    <Layout header="Список пользователей">
      <UsersWidget />
    </Layout>
  );
};

export { UsersPage };
