import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/utils";

type ButtonVariant = "red" | "default" | "gray";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

const Button: React.FC<IButtonProps> = ({ children, onClick, variant = "default", ...props }) => {
  const classes = cva("w-full p-[15px] rounded-[15px] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-auto", {
    variants: {
      variant: {
        default: "text-white bg-blue-800 hover:bg-blue-900",
        red: "text-white bg-red-500 hover:bg-red-600",
        gray: "bg-gray-100",
      },
    },
  });

  return (
    <button onClick={onClick} className={cn(classes({ variant }))} {...props}>
      {children}
    </button>
  );
};

export { Button };
