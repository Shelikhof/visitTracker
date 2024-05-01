import usersIcon from "../assets/icons/menu/users-icon.svg";
import groupsIcon from "../assets/icons/menu/groups-icon.svg";
import groupIcon from "../assets/icons/menu/group-icon.svg";
import reportIcon from "../assets/icons/menu/report-icon.svg";
import summaryIcon from "../assets/icons/menu/summary-icon.svg";

const MENU = {
  admin: [
    {
      label: "Группы",
      link: "/groups",
      icon: groupsIcon,
    },
    {
      label: "Пользователи",
      link: "/users",
      icon: usersIcon,
    },
  ],
  curator: [
    {
      label: "Отчёт",
      link: "/report",
      icon: reportIcon,
    },
    {
      label: "Сводка",
      link: "/summary",
      icon: summaryIcon,
    },
    {
      label: "Группа",
      link: "/group",
      icon: groupIcon,
    },
  ],
  praepostor: [
    {
      label: "Отчёт",
      link: "/report",
      icon: reportIcon,
    },
    {
      label: "Сводка",
      link: "/summary",
      icon: summaryIcon,
    },
  ],
  none: [],
};

export type Roles = "admin" | "curator" | "praepostor" | "none";

export { MENU };
