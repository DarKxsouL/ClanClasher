// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// const BASE_URL = 'https://api.clashofclans.com/v1';
// const TOKEN = process.env.COC_API_KEY;

// export const getPlayerData = async (playerTag: string) => {
//   try {
//     // Player tags in URL must be URL encoded (e.g., # becomes %23)
//     const encodedTag = encodeURIComponent(playerTag);
    
//     const response = await axios.get(`${BASE_URL}/players/${encodedTag}`, {
//       headers: {
//         Authorization: `Bearer ${TOKEN}`,
//         Accept: 'application/json',
//       },
//     });
    
//     return response.data;
//   } catch (error: any) {
//     console.error('Error fetching CoC data:', error.response?.data || error.message);
//     throw new Error('Failed to fetch player data');
//   }
// };

//new


import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'https://api.clashofclans.com/v1';
const TOKEN = process.env.COC_API_KEY;

export const getPlayerData = async (playerTag: string) => {
  // Fix: Supercell API requires # to be URL encoded as %23
  const formattedTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
  const encodedTag = encodeURIComponent(formattedTag);
  
  try {
    const response = await axios.get(`${BASE_URL}/players/${encodedTag}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('CoC API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Player not found');
  }
};