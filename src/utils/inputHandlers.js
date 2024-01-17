export const handleTitleChange = (e, setTitle) => {
  setTitle(e.target.value);
};

export const handleNumberChange = (e, setSelectedNumber) => {
  setSelectedNumber(e.target.value);
};

export const handleLogout = (navigate) => {
  navigate("/");
};
