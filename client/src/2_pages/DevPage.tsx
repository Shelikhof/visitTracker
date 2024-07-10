import React, { ChangeEvent } from "react";
import { Button, Input, PopUp, Select, Switch } from "../6_shared/ui";

// import UserService from "../api/UserService";
import { MONTH } from "../6_shared/variables/month";
// import axios from "axios";
import $api from "../5_entities/api";
import { Checkbox } from "../6_shared/ui/forms/Checkbox";

const DevPage = () => {
  const [value, setValue] = React.useState("");
  const onCLick = () => setIsOpenPopUp(true);
  const [value2, setValue2] = React.useState(false);
  const [value3, setValue3] = React.useState(false);
  const onChange = () => setValue2((value2) => !value2);
  // const onSearch = (searchValue: string) => {
  //   // console.log(searchValue);
  // };

  const [month, setMonth] = React.useState(MONTH[0]);
  const [isOpenPopUp, setIsOpenPopUp] = React.useState(false);
  // const fetchData = async (value: string) => {
  //   const data = await UserService.getAllUsers(1, 10, null, value);
  // return data.data.data;
  // };
  // const onClick2 = (value: string) => {
  //   // console.log(value);
  // };

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await $api.post("/groups/uploadFile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    setValue2((prev) => !prev);
    console.log(e.target.value);
  };

  const onChangeCheckbox2 = (e: ChangeEvent<HTMLInputElement>) => {
    setValue3((prev) => !prev);
    console.log(e.target.value);
  };

  return (
    <div>
      <Input value={value} setValue={setValue} placeholder="Введите ФИО" />
      <br />
      <br />
      <br />
      <Button onClick={onCLick} variant="gray" disabled>
        АЙАААА
      </Button>
      <br />
      <br />
      <br />
      <Switch onChange={onChange} value={value2} />
      <br />
      <br />
      <br />
      <Select value={month} options={MONTH} onChange={setMonth}></Select>
      <br />
      <br />
      <br />
      {/* <Search onSearch={onSearch} placeholder="Поиск" /> */}
      <br />
      <br />
      <br />

      <PopUp isOpen={isOpenPopUp} setIsOpen={setIsOpenPopUp}>
        <p>ПОПАП</p>
      </PopUp>
      <input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>заугрузить файл</Button>
      {/* <SearchDebounce fetchData={fetchData} onClick={onClick2} /> */}
      <Checkbox value={value2} onChange={onChangeCheckbox} />
      <Checkbox value={value3} onChange={onChangeCheckbox2} />
    </div>
  );
};

export { DevPage };
