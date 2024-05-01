import React from "react";
import styles from "./Input.module.css";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  setValue: (value: string) => void;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(({ value, setValue, ...props }, ref) => {
  return <input ref={ref} className={styles["input"]} value={value} onChange={(event) => setValue(event.target.value)} {...props} />;
});

export { Input };
