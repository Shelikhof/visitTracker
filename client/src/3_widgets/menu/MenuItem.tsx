import { Link, useLocation, useNavigate } from "react-router-dom";
import startsWithPath from "@/6_shared/utils/startsWithPath";
import exitIcon from "@/6_shared/assets/icons/menu/logout-icon.svg";
import AuthService from "@/5_entities/auth/AuthService";
import React from "react";
import { SubmitActionPopUp } from "@/6_shared/ui/SubmitActionPopUp";
import { cn } from "@/6_shared/utils/utils";

interface IMenuItemProps {
  label: string;
  link: string;
  icon: string;
}
const MenuItem: React.FC<IMenuItemProps> = ({ label, link, icon }) => {
  const location = useLocation();

  return (
    <li>
      <Link
        to={link}
        className={cn(
          "flex 1150px:p-[10px] items-center 1150px:gap-[10px] rounded-[10px] transition-all duration-300 hover:bg-blue-100 1150px:flex-row flex-col gap-0 p-[5px] w-auto text-xs 1150px:text-base",
          startsWithPath(location.pathname, link) && "bg-blue-100"
        )}
      >
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
      <div className="absolute z-[9999]">
        <SubmitActionPopUp isOpen={isOpenPopUp} message="Не забудьте завершить сессию в телеграм (чат Telegram)" onSubmit={logOut} setIsOpen={setIsOpenPopUp} />
      </div>
      <button
        className="flex 1150px:p-[10px] items-center 1150px:gap-[10px] rounded-[10px] transition-all duration-300 hover:bg-blue-100 1150px:flex-row flex-col gap-0 p-[5px] w-auto text-xs 1150px:text-base"
        onClick={() => setIsOpenPopUp(true)}
      >
        <img src={exitIcon} />
        Выйти
      </button>
    </>
  );
};

export { MenuItem, ExitMenuItem };
