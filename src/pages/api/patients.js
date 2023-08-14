// api/patients.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiUrl = 'http://localhost:3001' + req.url;

    if (req.method === 'GET') {
      const response = await axios.get(apiUrl);
      res.status(200).json(response.data);
      
    } else if (req.method === 'POST') {
      const response = await axios.post(apiUrl, req.body);
      res.status(200).json(response.data);

    } else if (req.method === 'PUT') {
      const response = await axios.put(apiUrl, req.body);
      res.status(200).json(response.data);

    } else if (req.method === 'DELETE') {
      const response = await axios.delete(apiUrl);
      res.status(200).json(response.data);

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
