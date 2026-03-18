import { Router } from 'express';
import { getPlayerData } from '../services/cocService';

const router = Router();

router.get('/:tag', async (req, res) => {
  try {
    const data = await getPlayerData(req.params.tag);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;