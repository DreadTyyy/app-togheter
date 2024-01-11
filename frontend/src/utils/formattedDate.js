const getFormattedDate = (rawDate) => {
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = new Date(rawDate).toLocaleDateString("id-ID", options);
  return formattedDate;
};

const getFormatedDateWithTime = (rawDate) => {
  const optionsTime = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedDate = getFormattedDate(rawDate);
  const formattedTime = new Date(rawDate).toLocaleTimeString(
    "id-ID",
    optionsTime
  );
  return `${formattedDate} ${formattedTime}`;
};

export { getFormattedDate, getFormatedDateWithTime };
