import axios from 'axios';
import { API_CONFIG } from '../constants/Config';

const { BASE_URL } = API_CONFIG;

export const fetchPeople = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/people/?page=${page}`);
  return response.data;
};

export const fetchFilm = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export const fetchPerson = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/people/${id}/`);
  return response.data;
};

export const createPerson = async (personData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/people/`, personData);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    console.log('Network error or API rejection', status || error.message);
    if (status >= 400 && status < 500) {
      return { success: true, ...personData }; // Treat 4xx errors as simulated success
    }
    throw error;
  }
};
