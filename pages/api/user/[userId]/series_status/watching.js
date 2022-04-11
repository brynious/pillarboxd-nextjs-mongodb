import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getUserDefaultList } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const seriesList = await getUserDefaultList(
    req.db,
    req.query.userId,
    'watching',
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ seriesList });
});

export default handler;
