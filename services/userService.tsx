import api from './api';

export const createSession = async () => {
  try {
    const response = await api.post('/create/session'); // adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};