import React from "react";
import styles from "./ContentContainer.module.css";
import classNames from "classnames";

type size = "small" | "large";

interface IContentContainerProps extends React.PropsWithChildren {
  size?: size;
  center?: boolean;
}

//ограничивает контент по ширине
const ContentContainer: React.FC<IContentContainerProps> = ({ size = "large", center = false, children }) => {
  const classes = classNames(
    styles["content-container"],
    center && styles["content-container-vertical-center"],
    size === "large" ? styles["content-container-large"] : styles["content-container-small"]
  );
  return <div className={classes}>{children}</div>;
};

export { ContentContainer };
