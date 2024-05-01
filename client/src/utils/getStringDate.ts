const getStringData = (date: Date) => {
  date.setHours(date.getHours() - 3);
  const str = `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
  return str;
};

export default getStringData;
