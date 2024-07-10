import { Layout } from "@/3_widgets/Layout";
import SummaryWidget from "@/3_widgets/summary/SummaryWidget";

const SummaryPage = () => {
  document.title = "Сводка за месяц";
  return (
    <Layout header="Сводка за месяц">
      <SummaryWidget />
    </Layout>
  );
};

export { SummaryPage };
