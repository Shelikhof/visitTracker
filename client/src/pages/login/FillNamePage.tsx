import { ContentContainer } from "../../components";
import { FillNameForm } from "../../widgets";

const FillNamePage = () => {
  document.title = "Заполните имя";
  return (
    <ContentContainer center>
      <FillNameForm />
    </ContentContainer>
  );
};

export { FillNamePage };
