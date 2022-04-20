import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getAllSeriesRatedByUser } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const seriesList = await getAllSeriesRatedByUser(
    req.db,
    req.query.userId,
    req.query.beforeScore ? Number(req.query.beforeScore) : undefined,
    req.query.beforeRatedAt ? new Date(req.query.beforeRatedAt) : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ seriesList });
});

export default handler;
