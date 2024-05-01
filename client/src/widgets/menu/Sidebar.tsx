import React from "react";
import useUserDataStore from "../../store/userData.store";
import { MENU } from "../../variables/menu";
import styles from "./Sidebar.module.css";
import { ExitMenuItem, MenuItem } from "./MenuItem";
import { MobileMenu } from "..";

const Sidebar = () => {
  const userData = useUserDataStore((state) => state.userData);
  const menuList = MENU[userData?.role || "none"];

  // console.log(userData);
  // console.log(location);
  // console.log(startsWithPath(location.pathname, "users"));

  return (
    <>
      <MobileMenu />
      <aside className={styles["sidebar"]}>
        <nav className={styles["menu"]}>
          <ul className={styles["menu-list"]}>
            {menuList.map((item) => (
              <MenuItem key={item.label} label={item.label} link={item.link} icon={item.icon} />
            ))}
          </ul>
        </nav>
        <div className={styles["siderbar-footer"]}>
          <button className={styles["username-button"]}>@{userData?.username}</button>
          <ExitMenuItem />
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
