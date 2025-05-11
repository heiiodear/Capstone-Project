export function formatDate(timestamp) {
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6) - 1;
  const day = timestamp.substring(6, 8);
  const hour = timestamp.substring(9, 11);
  const minute = timestamp.substring(11, 13);
  const second = timestamp.substring(13, 15);

  const date = new Date(year, month, day, hour, minute, second);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return date.toLocaleString("en-US", options);
}
