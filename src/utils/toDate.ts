export const toDate = (date: string) => {
  const d = new Date(Date.parse(date));
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${d.getDate()} ${month[d.getMonth()]}`;
};
