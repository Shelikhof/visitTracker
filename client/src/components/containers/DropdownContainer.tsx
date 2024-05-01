import React from "react";
import styles from "./DropdownContainer.module.css";
import { CSSTransition } from "react-transition-group";
interface IDropdownContainerProps extends React.PropsWithChildren {
  isOpen: boolean;
}

const DropdownContainer: React.FC<IDropdownContainerProps> = ({ isOpen, children }) => {
  return (
    <CSSTransition
      in={isOpen}
      unmountOnExit
      timeout={250}
      classNames={{
        enter: styles["dropdown-animatiom-enter"],
        enterActive: styles["dropdown-animatiom-enter-active"],
        exit: styles["dropdown-animatiom-exit"],
        exitActive: styles["dropdown-animatiom-exit-active"],
      }}
    >
      <div className={styles["dropdown-container"]}>{children}</div>
    </CSSTransition>
  );
};

interface IDropdownContainerItemProps extends React.PropsWithChildren {
  onClick: () => void;
}
const DropdownContainerItem: React.FC<IDropdownContainerItemProps> = ({ onClick, children }) => {
  return (
    <p className={styles["item"]} onClick={onClick}>
      {children}
    </p>
  );
};

export { DropdownContainer, DropdownContainerItem };
