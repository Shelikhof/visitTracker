import classNames from "classnames";
import React from "react";
import styles from "./Button.module.css";

type ButtonVariant = "red" | "default" | "gray";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

const Button: React.FC<IButtonProps> = ({ children, onClick, variant = "default", ...props }) => {
  const btnClasses = classNames(styles["button"], styles[`button--${variant}`]);

  return (
    <button onClick={onClick} className={btnClasses} {...props}>
      {children}
    </button>
  );
};

export { Button };
