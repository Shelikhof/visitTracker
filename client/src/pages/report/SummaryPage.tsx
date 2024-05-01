import React from "react";
import { Layout } from "../../components";
import { Summary } from "../../widgets";

const SummaryPage = () => {
  return (
    <Layout header="Сводка посещаемости за месяц">
      <Summary />
    </Layout>
  );
};

export { SummaryPage };
