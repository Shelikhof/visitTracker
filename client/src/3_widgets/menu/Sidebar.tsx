import React from "react";

import { MENU } from "@/6_shared/variables/menu";
import { ExitMenuItem, MenuItem } from "./MenuItem";
import { ChangeNamePopUp, MobileMenu } from "..";
import useUserDataStore from "@/5_entities/user/userData.store";

const Sidebar = () => {
  const userData = useUserDataStore((state) => state.userData);
  const menuList = MENU[userData?.role || "none"];
  const [isOpenChangeNamePopUp, setIsOpenChangeNamePopUp] = React.useState(false);

  return (
    <>
      <ChangeNamePopUp isOpen={isOpenChangeNamePopUp} setIsOpen={setIsOpenChangeNamePopUp} />
      <MobileMenu />
      <aside className="sticky top-0 p-[20px] h-screen 1150px:flex flex-col justify-between z-10 hidden">
        <nav className="max-w-[200px]">
          <ul className="grid items-center gap-[5px]">
            {menuList.map((item) => (
              <MenuItem key={item.label} label={item.label} link={item.link} icon={item.icon} />
            ))}
          </ul>
        </nav>
        <div className="grid gap-[10px]">
          <button className="text-left pl-3" onClick={() => setIsOpenChangeNamePopUp(true)}>
            @{userData?.username}
          </button>
          <ExitMenuItem />
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
