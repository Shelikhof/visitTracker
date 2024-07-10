const roleValidator = (role: string, accessRole: string[], page: JSX.Element, redirectPage: JSX.Element) => {
  const i = accessRole.indexOf(role);
  if (i === -1) {
    return redirectPage;
  }
  return page;
};

export default roleValidator;
