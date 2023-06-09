import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const createDataset = async (dataset: any) => {
  const response = await axios.post(`${BASE_URL}/datasets`, dataset);
  return response.data;
};
