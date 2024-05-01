import React from "react";
import { Layout } from "../../components";
import { Report } from "../../widgets";
import getStringData from "../../utils/getStringDate";

const ReportPage = () => {
  const [date, setDate] = React.useState(new Date());

  return (
    <Layout header={`Составление отчёта ${getStringData(date)}`} alignHeader="center">
      <Report setDate={setDate} />
    </Layout>
  );
};

export { ReportPage };
