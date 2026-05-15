const STORAGE_KEY = 'sgrm_pro_data';

export const getStorageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from Local Storage:', error);
    return null;
  }
};

export const setStorageData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to Local Storage:', error);
  }
};

export const initStorage = (initialData) => {
  const currentData = getStorageData();
  if (!currentData) {
    setStorageData(initialData);
    return initialData;
  }
  return currentData;
};
