import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/sync', async (req, res) => {
  const { uid, email } = req.body;
  try {
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({ firebaseUid: uid, email });
      await user.save();
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to sync user" });
  }
});

export default router;