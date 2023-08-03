// api/patients/[id].ts
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const API_ENDPOINT = "http://localhost:3001";
    const apiUrl = `${API_ENDPOINT}${req.url}`;
        console.log("Next.js API: Received a request with method:", req.method);

    if (req.method === 'GET') {
      console.log("Inside Next.js GET method");
      const response = await axios.get(apiUrl);
      res.status(200).json(response.data);

    } else if (req.method === 'POST') {
      console.log("Inside Next.js POST method");
      const response = await axios.post(apiUrl, req.body);
      res.status(200).json(response.data);

    } else if (req.method === 'PUT') {
      console.log("Inside Next.js PUT method");
      const response = await axios.put(apiUrl, req.body);
      res.status(200).json(response.data);

    } else if (req.method === 'DELETE') {
      console.log("Inside Next.js DELETE method");
      const response = await axios.delete(apiUrl);
      res.status(200).json(response.data);

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: error.message });
  }
}
