import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getSeriesRating } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(...auths, async (req, res) => {
  const rating = await getSeriesRating(req.db, {
    seriesId: req.query.seriesId,
    userId: req.user._id,
  });

  return res.json({ rating });
});

export default handler;
