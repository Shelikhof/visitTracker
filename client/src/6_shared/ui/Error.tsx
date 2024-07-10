import React from "react";

interface IErrorProps {
  message: string;
}

const Error: React.FC<IErrorProps> = ({ message }) => {
  return <p className="text-red-500 font-semibold">{message}</p>;
};

export { Error };
