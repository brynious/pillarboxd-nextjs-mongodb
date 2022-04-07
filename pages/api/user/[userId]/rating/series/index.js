import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getAllSeriesRatedByUser } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const seriesList = await getAllSeriesRatedByUser(req.db, req.query.userId);

  return res.json({ seriesList });
});

export default handler;
