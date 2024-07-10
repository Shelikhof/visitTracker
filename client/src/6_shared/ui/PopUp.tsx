import React from "react";
import styles from "./PopUp.module.css";
import { CSSTransition } from "react-transition-group";

interface IPopUpProps extends React.PropsWithChildren {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  title?: string;
}

const PopUp: React.FC<IPopUpProps> = ({ isOpen, setIsOpen, children, title }) => {
  const handleClickInside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  React.useEffect(() => {
    // Запрещаем прокрутку страницы при открытии модального окна
    if (isOpen) {
      // document.body.style.position = "fixed";
      document.body.style.overflowY = "hidden";
      // document.body.style.width = "100%";
    } else {
      // document.body.style.position = "static";
      document.body.style.overflowY = "auto";
    }
  }, [isOpen]);

  return (
    <CSSTransition
      in={isOpen}
      unmountOnExit
      timeout={250}
      classNames={{
        enter: styles["pop-up-animatiom-enter"],
        enterActive: styles["pop-up-animatiom-enter-active"],
        exit: styles["pop-up-animatiom-exit"],
        exitActive: styles["pop-up-animatiom-exit-active"],
      }}
    >
      <div className={styles["pop-up-root"]} onClick={() => setIsOpen(false)}>
        <div className={styles["pop-up"]} onClick={(e) => handleClickInside(e)}>
          {title && <h3>{title}</h3>}
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};

export { PopUp };
