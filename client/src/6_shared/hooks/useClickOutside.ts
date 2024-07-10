import React from "react";

//обработка клика, если клик вне контейнера, то закрывает окно
const handlerOutsideClick = (event: MouseEvent, containerRef: React.RefObject<HTMLDivElement>, setIsOpen: (value: boolean) => void) => {
  if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
    setIsOpen(false);
  }
};

const useClickOutside = (containerRef: React.RefObject<HTMLDivElement>, setIsOpen: (value: boolean) => void) => {
  const handleClickOutside = (event: MouseEvent) => {
    handlerOutsideClick(event, containerRef, setIsOpen);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
};

export default useClickOutside;
