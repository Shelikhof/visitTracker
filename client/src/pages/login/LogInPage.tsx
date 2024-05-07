import { ContentContainer } from "../../components";
import { TelegramWidget } from "../../widgets";

const LogInPage = () => {
  document.title = "Вход";
  return (
    <ContentContainer center>
      <TelegramWidget />
    </ContentContainer>
  );
};

export { LogInPage };
