export const sanitizeInput = (text) => {
  if (!text) return '';
  return text.toString().replace(/[<>]/g, '').trim();
};
