import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const getTestMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test message:', error);
    throw error;
  }
};

export const getHomeMessage = async () => {
  try {
    const response = await axios.get(`${API_URL}/home`);
    return response.data;
  } catch (error) {
    console.error('Error fetching home message:', error);
    throw error;
  }
};