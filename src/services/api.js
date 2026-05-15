import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const getApiUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error obteniendo usuarios de la API');
  }
};
