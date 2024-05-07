import React, { ChangeEvent } from "react";
import styles from "./AddFile.module.css";

interface IAddFileProps {
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

const AddFile: React.FC<IAddFileProps> = ({ handleFileChange, file }) => {
  return (
    <>
      <label htmlFor="file" className={styles["label"]}>
        {"Выбор файла"}
      </label>
      <p className={styles["input-placeholder"]}>{file ? file.name : "Файл не выбран"}</p>
      <input type="file" id="file" className={styles["input"]} onChange={handleFileChange} />
    </>
  );
};

export { AddFile };
