export const formatDateShort = (date: string, locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    timeZone: 'utc',
  });
};
