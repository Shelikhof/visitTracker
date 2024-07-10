import React from "react";
import { cn } from "@/6_shared/utils/utils";

type size = "small" | "large";

interface IContentContainerProps extends React.PropsWithChildren {
  size?: size;
  center?: boolean;
}

//ограничивает контент по ширине
const ContentContainer: React.FC<IContentContainerProps> = ({ size = "large", center = false, children }) => {
  const classes = cn("px-[5px] mx-auto w-full xl:pb-[50px] pb-[90px]", center && "min-h-dvh flex items-center justify-center h-full", size === "large" ? "max-w-[1250px]" : "max-w-[1000px]");
  return <div className={classes}>{children}</div>;
};

export { ContentContainer };
