// src/pages/api/users.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const response = await axios.get('http://localhost:3001' + req.url);
      res.status(200).json(response.data);
    } else if (req.method === 'POST') {
      const response = await axios.post('http://localhost:3001' + req.url, req.body);
      res.status(200).json(response.data);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
}
