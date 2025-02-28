import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const response = await fetch(`${API_URL}/search?term=${encodeURIComponent(term as string)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch search results');
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch search results' 
    });
  }
}