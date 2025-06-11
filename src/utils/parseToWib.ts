export function parseToWIB(dateStr: string): string {
  const date = new Date(dateStr);

  // Convert to GMT+7 (WIB) by adding 7 hours
  const wibDate = new Date(date.getTime());

  const day = String(wibDate.getDate()).padStart(2, "0");
  const monthNames = [
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
  const month = monthNames[wibDate.getMonth()];
  const year = wibDate.getFullYear();

  const hours = String(wibDate.getHours()).padStart(2, "0");
  const minutes = String(wibDate.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
}
