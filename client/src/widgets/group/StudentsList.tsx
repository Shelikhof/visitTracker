import React from "react";
import { IGetGroupInfoResponse, IStudent } from "../../api/interfaces/IGroupService.interface";
import { Button } from "../../UI";
import { StudentPopUp } from "./StudentPopUp";
import { dynamicSliceString } from "../../utils/sliceString";
import styles from "./StudentsList.module.css";
import { SubmitActionPopUp } from "../SubmitActionPopUp";
import { AddStudentFilePopUp } from "./AddStudentFilePopUp";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IStudentsListProps {
  students: IStudent[] | null;
  setStudents: (value: IStudent[] | null) => void;
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IGetGroupInfoResponse, Error>>;
}

const StudentsList: React.FC<IStudentsListProps> = ({ setStudents, refetch, students = [] }) => {
  const [isOpenStudentPopUp, setIsOpenStudentPopUp] = React.useState(false);
  const [isOpenDeleteStudentPopUp, setIsOpenDeleteStudentPopUp] = React.useState(false);
  const [isOpenAddStudentFilePopUp, setIsOpenAddStudentFilePopUp] = React.useState(false);
  const [currentStudent, setCurrentStudent] = React.useState<IStudent | null>(null);

  React.useEffect(() => {
    if (!isOpenStudentPopUp && !isOpenDeleteStudentPopUp) setCurrentStudent(null);
  }, [isOpenStudentPopUp, isOpenDeleteStudentPopUp]);

  const deleteStudent = (student: IStudent) => {
    if (students) setStudents(students.filter((item) => item.id !== student.id));
  };

  const handleDelete = (student: IStudent) => {
    setCurrentStudent(student);
    setIsOpenDeleteStudentPopUp(true);
  };

  const handleEdit = (student: IStudent) => {
    setCurrentStudent(student);
    setIsOpenStudentPopUp(true);
  };

  const onSubmitPopUp = (student: IStudent) => {
    if (students === null) return;
    if (student.id) {
      setStudents(students.map((item) => (item.id === student.id ? student : item)));
    } else {
      student.id = `new-${crypto.randomUUID()}`;
      setStudents([...students, student]);
    }
  };

  return (
    <>
      <AddStudentFilePopUp isOpen={isOpenAddStudentFilePopUp} setIsOpen={setIsOpenAddStudentFilePopUp} refetch={refetch} />
      <SubmitActionPopUp
        isOpen={isOpenDeleteStudentPopUp}
        setIsOpen={setIsOpenDeleteStudentPopUp}
        message={`Удалить студента ${currentStudent?.fullName}?`}
        onSubmit={() => deleteStudent(currentStudent!)}
      />
      <StudentPopUp isOpen={isOpenStudentPopUp} setIsOpen={setIsOpenStudentPopUp} student={currentStudent} onSubmit={onSubmitPopUp} />
      <div className={styles["students-list-wrapper"]}>
        <div className={styles["buttons"]}>
          <Button onClick={() => setIsOpenStudentPopUp(true)}>Добавить студента</Button>
          <Button onClick={() => setIsOpenAddStudentFilePopUp(true)}>Загрузить из файла</Button>
        </div>
        {students && (
          <ul className={styles["students-list"]}>
            {students.map((student, i) => (
              <StudentItem key={i} {...student} onDelete={() => handleDelete(student)} onEdit={() => handleEdit(student)} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

interface IStudentItemProps extends IStudent {
  onEdit: () => void;
  onDelete: () => void;
}

const StudentItem: React.FC<IStudentItemProps> = ({ fullName, isIP, onDelete, onEdit }) => {
  return (
    <li className={styles["student-item"]}>
      <p className={styles["fullName"]}>{dynamicSliceString(fullName)}</p>
      <p>{isIP && "ИП"}</p>
      <div className={styles["item-buttons"]}>
        <button className={styles["item-button"]} onClick={onEdit}>
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.5 18V12H10.5V14H18.5V16H10.5V18H8.5ZM0.5 16V14H6.5V16H0.5ZM4.5 12V10H0.5V8H4.5V6H6.5V12H4.5ZM8.5 10V8H18.5V10H8.5ZM12.5 6V0H14.5V2H18.5V4H14.5V6H12.5ZM0.5 4V2H10.5V4H0.5Z"
              fill="#000F22"
            />
          </svg>
        </button>
        <button className={styles["item-button"]} onClick={onDelete}>
          <svg width="15" height="2" viewBox="0 0 15 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 2V0H14.5V2H0.5Z" fill="#000F22" />
          </svg>
        </button>
      </div>
    </li>
  );
};

export { StudentsList };
