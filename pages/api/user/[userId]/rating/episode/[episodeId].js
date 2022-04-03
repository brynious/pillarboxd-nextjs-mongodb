import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getEpisodeRating } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const rating = await getEpisodeRating(req.db, {
    episodeId: req.query.episodeId,
    userId: req.query.userId,
  });

  return res.json({ rating });
});

export default handler;
