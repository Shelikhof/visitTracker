const sliceString = (string: string, maxLength: number) => {
  return string.length > maxLength ? string.slice(0, maxLength) + "..." : string;
};

const dynamicSliceString = (string: string) => {
  return sliceString(string, window.innerWidth < 400 ? 14 : 30);
};

export default sliceString;
export { dynamicSliceString };
