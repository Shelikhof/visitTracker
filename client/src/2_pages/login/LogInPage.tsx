import { ContentContainer } from "@/6_shared/components";
import { TelegramWidget } from "@/3_widgets";

const LogInPage = () => {
  document.title = "Вход";
  return (
    <ContentContainer center>
      <TelegramWidget />
    </ContentContainer>
  );
};

export { LogInPage };
