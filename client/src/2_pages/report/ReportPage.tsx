import { Report } from "@/3_widgets";
import { Layout } from "@/6_shared/components";
import getStringData from "@/6_shared/utils/getStringDate";
import React from "react";

const ReportPage = () => {
  const [date, setDate] = React.useState(new Date());

  document.title = `Составление отчёта ${getStringData(date)}`;
  return (
    <Layout header={`Составление отчёта ${getStringData(date)}`} alignHeader="center">
      <Report setDate={setDate} />
    </Layout>
  );
};

export { ReportPage };
