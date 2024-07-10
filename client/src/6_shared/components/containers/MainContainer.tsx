import React from "react";

interface IMainContainerProps extends React.PropsWithChildren {}

//создаёт три колонки, где первая колонка для меню, вторая для контента. на 1150px становится 1 колонка во всю ширину
const MainContainer: React.FC<IMainContainerProps> = ({ children }) => {
  return <div className="min-h-dvh grid grid-cols-1 1150px:grid-cols-main-container-2 1700px:grid-cols-main-container-3">{children}</div>;
};

export { MainContainer };
