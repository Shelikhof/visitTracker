import React, { ChangeEvent } from "react";
import { AddFile, Button, Error, PopUp } from "@/6_shared/ui";
import GroupService from "@/5_entities/group/GroupService";
import { isAxiosError } from "axios";
import { ERRORS } from "@/6_shared/variables/errors";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { IGetGroupInfoResponse } from "@/5_entities/group/IGroupService.interface";
import useSelectedGroupInfoStore from "@/5_entities/group/selectedGroupInfo.store";

interface IAddStudentFilePopUpProps {
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IGetGroupInfoResponse, Error>>;
}

const AddStudentFilePopUp: React.FC<IAddStudentFilePopUpProps> = ({ isOpen, setIsOpen, refetch }) => {
  const group = useSelectedGroupInfoStore((state) => state.group);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    setSelectedFile(null);
    setError("");
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      await GroupService.uploadStudentFromFile(selectedFile, group?.id || "");
      refetch();
      setIsOpen(false);
    } catch (error) {
      if (!isAxiosError(error)) return;
      if (error.response?.data.message === ERRORS.TOO_MANY_STUDENTS) setError("Максимальное количество студентов в группе 25 человек");
      else setError("Произошло непредвиденная ошибка");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setSelectedFile(event.target.files[0]);
      setError("Неверный формат файла");
      return;
    }
    setSelectedFile(event.target.files[0]);
  };

  return (
    <PopUp title="Добавить студентов из файла" isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="mb-6">
        <AddFile handleFileChange={handleFileChange} file={selectedFile} />
        <Error message={error} />
      </div>
      <div className="flex gap-3">
        <Button variant="gray" onClick={() => setIsOpen(false)}>
          Отмена
        </Button>
        <Button disabled={!!error || !selectedFile} onClick={handleSubmit}>
          Подтвердить
        </Button>
      </div>
    </PopUp>
  );
};

export { AddStudentFilePopUp };
