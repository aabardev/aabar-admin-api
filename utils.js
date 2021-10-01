const monthNameFull = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthNameShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getDayPostfix = (day) => {
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const getDateOnly = (date) => {
  const dd = date.getDate();
  const mm = date.getMonth();
  const yyyy = date.getFullYear();
  return `${dd}${getDayPostfix(dd)} ${monthNameShort[mm]}, ${yyyy}`;
};

export const dateFormatForFilename = (date) => {
  const format = (x) => (x < 10 ? `0${x}` : `${x}`);
  const h = format(date.getHours());
  const m = format(date.getMinutes());
  const s = format(date.getSeconds());
  const dd = format(date.getDate());
  const mm = format(date.getMonth() + 1);
  const yyyy = date.getFullYear();

  return `${yyyy}${mm}${dd}${h}${m}${s}`;
};

export const imgTypeCodes = {
  'mc': 'menu_category',
  'mcl': 'menu_category_large',
  'mi': 'menu_item',
  'e': 'event',
  'o': 'offer'
}