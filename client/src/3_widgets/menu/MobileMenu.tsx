import { MENU } from "@/6_shared/variables/menu";
import { ExitMenuItem, MenuItem } from "./MenuItem";
import useUserDataStore from "@/5_entities/user/userData.store";

const MobileMenu = () => {
  const userData = useUserDataStore((state) => state.userData);
  const menuList = MENU[userData?.role || "none"];

  return (
    <nav className="block 1150px:hidden fixed z-[999] bg-white w-full bottom-0 border border-solid border-gray-300">
      <ul className="flex justify-around max-w-[350px] mx-auto py-[10px]">
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
