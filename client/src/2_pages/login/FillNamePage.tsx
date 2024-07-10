import { ContentContainer } from "@/6_shared/components";
import { FillNameForm } from "@/3_widgets";

const FillNamePage = () => {
  document.title = "Заполните имя";
  return (
    <ContentContainer center>
      <FillNameForm />
    </ContentContainer>
  );
};

export { FillNamePage };
