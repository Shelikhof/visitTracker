import { Layout } from "@/6_shared/components";

const NotFoundPage = () => {
  document.title = "Страница не найдена";
  return (
    <Layout header="Cтраница не найдена" alignHeader="center">
      {/* NotFoundPage */}
    </Layout>
  );
};

export { NotFoundPage };
