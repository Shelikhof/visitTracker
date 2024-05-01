import React from "react";
import { DropdownContainer, DropdownContainerItem } from "../components";
import { Input } from "./forms/Input";
import debounce from "debounce";
import { IUserData } from "../api/interfaces/IUserService.interface";
import styles from "./SearchDebounce.module.css";
import useClickOutside from "../hooks/useClickOutside";

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
    <div className={styles["search-debounce"]} ref={containerRef}>
      <Input setValue={hanldeChanges} value={searchValue} placeholder={placeholder} />
      <div className={styles["dropdown-wrapper"]}>
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
