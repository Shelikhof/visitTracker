import React from "react";
import styles from "./CheckBox.module.css";

interface IInputCheckboxProps {
  value: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<IInputCheckboxProps> = ({ value, onChange }) => {
  return (
    <>
      <label className={styles["checkbox"]}>
        <input type="checkbox" checked={value} onChange={onChange} />
        <span></span>
      </label>
    </>
  );
};

export { Checkbox };
