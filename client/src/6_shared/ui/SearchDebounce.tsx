import React from "react";

import { Input } from "./forms/Input";
import debounce from "debounce";
import { IUserData } from "../../5_entities/user/IUserService.interface";
import useClickOutside from "../hooks/useClickOutside";
import { DropdownContainer, DropdownContainerItem } from "@/6_shared/components";

interface ISearchDebounceProps {
  placeholder?: string;
  fetchData: (value: string) => Promise<any[]>;
  onClick: (value: IUserData | null) => void;
  defaultValue?: string;
}

export interface IRefSearchDebounce {
  setValue: (value: string) => void;
}

const SearchDebounce = React.forwardRef<IRefSearchDebounce, ISearchDebounceProps>(({ fetchData, onClick, placeholder = "Поиск", defaultValue = "" }, ref) => {
  const [searchValue, setSearchValue] = React.useState(defaultValue);
  const [data, setData] = React.useState<IUserData[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useImperativeHandle(ref, () => ({
    setValue: (value: string) => setSearchValue(value),
  }));

  React.useEffect(() => {
    setSearchValue(defaultValue);
  }, [defaultValue]);

  const debouncedFetchData = React.useMemo(
    () =>
      debounce(async (value: string) => {
        if (value === "") onClick(null);
        const res = await fetchData(value);
        setData(res);
        setIsOpen(true);
      }, 250),
    [fetchData]
  );

  const hanldeChanges = (value: string) => {
    setSearchValue(value);
    debouncedFetchData(value);
  };

  const handleSelect = (value: IUserData) => {
    onClick(value);
    setIsOpen(false);
    setSearchValue(value.fullName);
  };

  useClickOutside(containerRef, setIsOpen);

  return (
    <div className="relative" ref={containerRef}>
      <Input setValue={hanldeChanges} value={searchValue} placeholder={placeholder} />
      <div className="absolute w-full top-[calc(100%+5px)]">
        {data.length > 0 && searchValue && (
          <DropdownContainer isOpen={isOpen}>
            {data.map((item) => (
              <DropdownContainerItem onClick={() => handleSelect(item)} key={item.id}>
                {item.fullName}
              </DropdownContainerItem>
            ))}
          </DropdownContainer>
        )}
      </div>
    </div>
  );
});

export { SearchDebounce };
