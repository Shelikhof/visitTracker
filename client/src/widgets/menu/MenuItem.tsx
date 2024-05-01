import classNames from "classnames";
import styles from "./MenuItem.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import startsWithPath from "../../utils/startsWithPath";
import exitIcon from "../../assets/icons/menu/logout-icon.svg";
import AuthService from "../../api/AuthService";
import React from "react";
import { SubmitActionPopUp } from "../SubmitActionPopUp";
interface IMenuItemProps {
  label: string;
  link: string;
  icon: string;
}
const MenuItem: React.FC<IMenuItemProps> = ({ label, link, icon }) => {
  const location = useLocation();

  return (
    <li>
      <Link to={link} className={classNames(styles["menu-item"], startsWithPath(location.pathname, link) && styles["menu-item--active"])}>
        <img src={icon} />
        {label}
      </Link>
    </li>
  );
};

const ExitMenuItem = () => {
  const navigate = useNavigate();
  const [isOpenPopUp, setIsOpenPopUp] = React.useState(false);
  const logOut = async () => {
    await AuthService.logout();
    navigate("/login");
  };

  return (
    <>
      <div className={styles["pop-up"]}>
        <SubmitActionPopUp isOpen={isOpenPopUp} message="Не забудьте завершить сессию в телеграм (чат Telegram)" onSubmit={logOut} setIsOpen={setIsOpenPopUp} />
      </div>
      <button className={styles["menu-item"]} onClick={() => setIsOpenPopUp(true)}>
        <img src={exitIcon} />
        Выйти
      </button>
    </>
  );
};

export { MenuItem, ExitMenuItem };
