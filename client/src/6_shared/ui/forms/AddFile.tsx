import React, { ChangeEvent } from "react";

interface IAddFileProps {
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
}

const AddFile: React.FC<IAddFileProps> = ({ handleFileChange, file }) => {
  return (
    <>
      <label htmlFor="file" className="w-full p-[15px] rounded-[15px] transition-all duration-300 text-white bg-blue-800 block text-center cursor-pointer">
        Выбор файла
      </label>
      <p className="mt-3">{file ? file.name : "Файл не выбран"}</p>
      <input type="file" id="file" className="hidden" onChange={handleFileChange} />
    </>
  );
};

export { AddFile };
