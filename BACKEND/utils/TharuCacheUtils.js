// utils/TharuCacheUtils.js
exports.isCacheValid = (lastFetchedTime) => {
  if (!lastFetchedTime) return false;
  const oneHour = 60 * 60 * 1000; // 1 hour in ms
  return new Date() - new Date(lastFetchedTime) < oneHour;
};
