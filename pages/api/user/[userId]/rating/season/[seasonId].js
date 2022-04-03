import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getSeasonRating } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const rating = await getSeasonRating(req.db, {
    seasonId: req.query.seasonId,
    userId: req.query.userId,
  });

  return res.json({ rating });
});

export default handler;
