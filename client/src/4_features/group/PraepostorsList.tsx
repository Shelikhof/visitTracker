import React from "react";
import { IPraepostor } from "@/5_entities/group/IGroupService.interface";
import { Button, IRefSearchDebounce, SearchDebounce } from "@/6_shared/ui";
import UserService from "@/5_entities/user/UserService";
import { dynamicSliceString } from "@/6_shared/utils/sliceString";

interface IPraepostorsListProps {
  praepostors: IPraepostor[];
  setPraepostors: (value: IPraepostor[] | null) => void;
}

const PraepostorsList: React.FC<IPraepostorsListProps> = ({ setPraepostors, praepostors = [] }) => {
  //получить пользователей без роли по поиску
  const fetchData = async (value: string) => {
    const data = await UserService.getAllUsers(1, 10, "none", value);
    return data.data;
  };

  const [currentPraepostorSearch, setCurrentPraepostorSearch] = React.useState<IPraepostor | null>(null);
  const searchDebounceRef = React.useRef<IRefSearchDebounce>(null);

  const addPraepostor = () => {
    if (!currentPraepostorSearch) return;
    if (praepostors.find((praepostor) => praepostor.id === currentPraepostorSearch.id)) return;
    setPraepostors([...praepostors, currentPraepostorSearch]);
    if (searchDebounceRef.current) searchDebounceRef.current.setValue("");
  };

  const deletePraepostor = (praepostor: IPraepostor) => {
    setPraepostors(praepostors.filter((item) => item.id !== praepostor.id));
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-4">
        <SearchDebounce fetchData={fetchData} onClick={setCurrentPraepostorSearch} ref={searchDebounceRef} placeholder="Введите ФИО" />
        <Button onClick={addPraepostor}>Добавить старосту</Button>
      </div>
      <ul className="grid gap-[20px]">
        {praepostors.map((praepostor) => (
          <PraepostorItem key={praepostor.id} onClick={() => deletePraepostor(praepostor)} {...praepostor} />
        ))}
      </ul>
    </div>
  );
};

interface IPraepostorItemProps extends IPraepostor {
  onClick: () => void;
}

const PraepostorItem: React.FC<IPraepostorItemProps> = ({ fullName, username, onClick }) => {
  return (
    <li className="flex justify-between items-start">
      <div>
        <p>{dynamicSliceString(fullName)}</p>
        <p className="text-xs text-gray-300">@{username}</p>
      </div>
      <button onClick={onClick} className="w-[25px] h-[25px] flex items-center justify-center justify-self-center">
        <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.5 2V0H14.5V2H0.5Z" fill="#000F22" />
        </svg>
      </button>
    </li>
  );
};

export { PraepostorsList };
