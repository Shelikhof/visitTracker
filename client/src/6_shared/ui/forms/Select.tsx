import React from "react";

import useClickOutside from "../../hooks/useClickOutside";
import { DropdownContainer, DropdownContainerItem } from "@/6_shared/components";

export type item = { value: string; id: string };

interface ISelectProps {
  value: item;
  options: item[];
  onChange: (value: item) => void;
}

const Select: React.FC<ISelectProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  //обработка клика из выпадающего списка
  const handleClick = (value: item) => {
    setIsOpen((prev) => !prev);
    onChange(value);
  };

  //закрытие окна, если клин вне селекта
  useClickOutside(containerRef, setIsOpen);

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Лейбл */}
      <div
        className="group flex justify-between items-center w-full cursor-pointer p-[15px] border-2 border-solid border-gray-300 rounded-[10px] select-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{value.value}</p>
        <svg className="group-hover:translate-y-[5px] transition-all duration-300" width="17" height="11" viewBox="0 0 17 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-4.19617e-05 2.07292L1.47912 0.59375L8.33329 7.44792L15.1875 0.59375L16.6666 2.07292L8.33329 10.4062L-4.19617e-05 2.07292Z" fill="black" />
        </svg>
      </div>

      {/* Выпадающий список */}
      <div className="absolute w-full z-[900] top-[calc(100%+5px)]">
        <DropdownContainer isOpen={isOpen}>
          {options.map((el) => {
            return (
              <DropdownContainerItem key={el.id} onClick={() => handleClick(el)}>
                {el.value}
              </DropdownContainerItem>
            );
          })}
        </DropdownContainer>
      </div>
    </div>
  );
};

export { Select };
