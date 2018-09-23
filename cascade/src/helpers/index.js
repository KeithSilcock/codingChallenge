//takes in month and year, returns array of UTC days
export function getArrayOfDaysInMonth(month, year) {
  const startDate = new Date(year, month - 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const SECONDSINADAY = 1000 * 60 * 60 * 24;

  const daysArray = [];
  for (let day = 0; day < daysInMonth; day++) {
    const newDay = new Date(startDate.getTime() + SECONDSINADAY * day);

    daysArray.push(newDay);
  }
  return daysArray;
}
