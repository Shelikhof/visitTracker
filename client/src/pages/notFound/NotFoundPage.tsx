import React from "react";
import { Layout } from "../../components";

const NotFoundPage = () => {
  document.title = "Страница не найдена";
  return (
    <Layout header="Cтраница не найдена" alignHeader="center">
      {/* NotFoundPage */}
    </Layout>
  );
};

export { NotFoundPage };
