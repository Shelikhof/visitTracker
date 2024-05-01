import React from "react";
import styles from "./MainContainer.module.css";

interface IMainContainerProps extends React.PropsWithChildren {}

//создаёт три колонки, где первая колонка для меню, вторая для контента. на 1150px становится 1 колонка во всю ширину
const MainContainer: React.FC<IMainContainerProps> = ({ children }) => {
  return <div className={styles["main-container"]}>{children}</div>;
};

export { MainContainer };
