import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getVillageStats = (buildings: any[], townHallLevel: number) => 
  API.post('/calculate', { buildings, townHallLevel });

export const getPlayerProfile = (tag: string) => 
  API.get(`/player/${tag.replace('#', '')}`);