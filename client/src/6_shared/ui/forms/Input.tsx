import React from "react";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(({ value, setValue, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className="p-[15px] rounded-[10px] border-2 border-solid border-gray-300 w-full transition-all duration-300 placeholder:text-gray-300 focus:border-gray-500"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      {...props}
    />
  );
});

export { Input };
