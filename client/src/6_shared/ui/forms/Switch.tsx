import React from "react";
import styles from "./Switch.module.css";

interface ISwitchProps {
  value: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Switch: React.FC<ISwitchProps> = ({ onChange, value }) => {
  return (
    <label className={styles["switch"]}>
      <input type="checkbox" onChange={onChange} checked={value} />
      {/* кружок */}
      <span></span>
    </label>
  );
};

export { Switch };
