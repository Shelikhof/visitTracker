import React from "react";
import { Button, Input, PopUp, Search, SearchDebounce, Select, Switch } from "../UI";

import UserService from "../api/UserService";
import { MONTH } from "../variables/month";

const DevPage = () => {
  const [value, setValue] = React.useState("");
  const onCLick = () => setIsOpenPopUp(true);
  const [value2, setValue2] = React.useState(false);
  const onChange = () => setValue2((value2) => !value2);
  const onSearch = (searchValue: string) => {
    // console.log(searchValue);
  };

  const [month, setMonth] = React.useState(MONTH[0]);
  const [isOpenPopUp, setIsOpenPopUp] = React.useState(false);
  const fetchData = async (value: string) => {
    const data = await UserService.getAllUsers(1, 10, null, value);
    // return data.data.data;
  };
  const onClick2 = (value: string) => {
    // console.log(value);
  };
  return (
    <div>
      <Input value={value} setValue={setValue} placeholder="Введите ФИО" />
      <br />
      <br />
      <br />
      <Button onClick={onCLick} variant="red">
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
      <Search onSearch={onSearch} placeholder="Поиск" />
      <br />
      <br />
      <br />

      <PopUp isOpen={isOpenPopUp} setIsOpen={setIsOpenPopUp}>
        <p>ПОПАП</p>
      </PopUp>
      {/* <SearchDebounce fetchData={fetchData} onClick={onClick2} /> */}
    </div>
  );
};

export { DevPage };
