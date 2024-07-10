import React from "react";
import { CSSTransition } from "react-transition-group";
interface IDropdownContainerProps extends React.PropsWithChildren {
  isOpen: boolean;
}

const DropdownContainer: React.FC<IDropdownContainerProps> = ({ isOpen, children }) => {
  return (
    <CSSTransition
      in={isOpen}
      unmountOnExit
      timeout={300}
      classNames={{
        enter: "opacity-0",
        enterActive: "opacity-100 transition-all duration-300",
        exitActive: "opacity-0 transition-all duration-300",
      }}
    >
      <div className="z-[100] w-full p-[5px] border-2 border-solid border-gray-300 bg-white rounded-[10px] max-h-[250px] overflow-y-auto">{children}</div>
    </CSSTransition>
  );
};

interface IDropdownContainerItemProps extends React.PropsWithChildren {
  onClick: () => void;
}
const DropdownContainerItem: React.FC<IDropdownContainerItemProps> = ({ onClick, children }) => {
  return (
    <p className="w-full cursor-pointer p-[5px] hover:underline" onClick={onClick}>
      {children}
    </p>
  );
};

export { DropdownContainer, DropdownContainerItem };
