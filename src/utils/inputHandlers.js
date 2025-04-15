export const handleTitleChange = (e, setTitle) => {
  setTitle(e.target.value);
};

export const handleNumberChange = (e, setSelectedNumber) => {
  setSelectedNumber(e.target.value);
};

// export const handleFormatChange = (e, setSelectedNumber) => {
//   setSelectedNumber(e.target.value);
// };

// export const handleAudienceChange = (e, setSelectedNumber) => {
//   setSelectedNumber(e.target.value);
// };

// export const handleLengthChange = (e, setSelectedNumber) => {
//   setSelectedNumber(e.target.value);
// };

export const handleLogout = (navigate) => {
  navigate("/home");
};
