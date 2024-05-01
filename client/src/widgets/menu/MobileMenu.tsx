import { MENU } from "../../variables/menu";
import useUserDataStore from "../../store/userData.store";
import { ExitMenuItem, MenuItem } from "./MenuItem";
import styles from "./MobileMenu.module.css";

const MobileMenu = () => {
  const userData = useUserDataStore((state) => state.userData);
  const menuList = MENU[userData?.role || "none"];

  return (
    <nav className={styles["mobile-menu"]}>
      <ul className={styles["menu-list"]}>
        {menuList.map((item) => (
          <MenuItem key={item.label} label={item.label} link={item.link} icon={item.icon} />
        ))}
        <li>
          <ExitMenuItem />
        </li>
      </ul>
    </nav>
  );
};

export { MobileMenu };
