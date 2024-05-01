import React from "react";
import { MainContainer } from "./MainContainer";

import { ContentContainer } from "./ContentContainer";
import classNames from "classnames";
import styles from "./Layout.module.css";
import { Sidebar } from "../../widgets";

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
        <h2 className={classNames(styles["header"], alignHeader === "center" && styles["header-center"])}>{header}</h2>
        <main className={styles["main"]}>{children}</main>
      </ContentContainer>
    </MainContainer>
  );
};

export { Layout };
