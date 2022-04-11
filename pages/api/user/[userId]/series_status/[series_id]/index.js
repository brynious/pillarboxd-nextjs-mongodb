import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getUserSeriesStatus } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const status = await getUserSeriesStatus(req.db, {
    series_id: req.query.series_id,
    user_id: req.query.userId,
  });

  return res.json({ status });
});

export default handler;
