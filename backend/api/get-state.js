import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  try {
    // Четем състоянието от базата
    const isLocked = await redis.get('lock_status');

    // Ако няма нищо в базата, по подразбиране връщаме, че е заключено (true)
    res.status(200).json({ locked: isLocked !== null ? isLocked : true });
  } catch (error) {
    res.status(500).json({ error: 'Грешка при четене от базата данни' });
  }
}