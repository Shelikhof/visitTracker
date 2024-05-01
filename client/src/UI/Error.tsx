import React from "react";
import styles from "./Error.module.css";

interface IErrorProps {
  message: string;
}

const Error: React.FC<IErrorProps> = ({ message }) => {
  return <p className={styles["error"]}>{message}</p>;
};

export { Error };
