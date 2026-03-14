import { Redis } from '@upstash/redis';

// Свързваме се с базата автоматично
const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Разрешени са само POST заявки' });
  }

  const { locked } = req.body;

  if (typeof locked !== 'boolean') {
    return res.status(400).json({ error: 'Невалидни данни. "locked" трябва да е true или false.' });
  }

  try {
    // Записваме състоянието в базата данни
    await redis.set('lock_status', locked);
    res.status(200).json({ success: true, current_state: locked });
  } catch (error) {
    res.status(500).json({ error: 'Грешка при запис в базата данни' });
  }
}