export const formatTimeSpent = (startDate, endDate) => {
  const diff = endDate - startDate;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    raw: diff,
    formatted: hours > 0 
      ? `${hours}h ${minutes}m ${seconds}s`
      : minutes > 0 
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`
  };
}; 