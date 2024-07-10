import React from "react";
import { MainContainer } from "../6_shared/components/containers/MainContainer";

import { ContentContainer } from "../6_shared/components/containers/ContentContainer";
import { Sidebar } from "@/3_widgets/menu/Sidebar";
import { cn } from "@/6_shared/utils/utils";

interface ILayoutProps extends React.PropsWithChildren {
  header: string;
  alignHeader?: "left" | "center";
  size?: "large" | "small";
}

//разметка с меню и названием вкладки над контентом
const Layout: React.FC<ILayoutProps> = ({ header, alignHeader = "left", size = "large", children }) => {
  return (
    <MainContainer>
      <Sidebar />
      <ContentContainer size={size}>
        <h2 className={cn("font-semibold 1150px:mb-8 1150px:mt-6 1150px:text-4xl my-4 text-2xl", alignHeader === "center" && "text-center")}>{header}</h2>
        <main className="h-auto">{children}</main>
        <div className="font-semibold mb-8 mt-6 text-4xl"></div>
      </ContentContainer>
    </MainContainer>
  );
};

export { Layout };
