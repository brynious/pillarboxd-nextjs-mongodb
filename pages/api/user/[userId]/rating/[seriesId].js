import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getSeriesRating } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  console.log(req.query.seriesId);
  console.log(req.query.userId);
  const rating = await getSeriesRating(req.db, {
    seriesId: req.query.seriesId,
    userId: req.query.userId,
  });

  return res.json({ rating });
});

export default handler;
