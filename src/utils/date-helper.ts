export const getFullDateString = (timestamp: Date) => {
  return timestamp.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getFullHourString = (timestamp: Date) => {
  return `${timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit',
  })} UTC`;
};
