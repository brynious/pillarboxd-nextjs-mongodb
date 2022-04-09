import { getAllSeries } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const seriesList = await getAllSeries(
    req.db,
    req.query.before ? parseInt(req.query.before, 10) : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  res.json({ seriesList });
});

export default handler;
