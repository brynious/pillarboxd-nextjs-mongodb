import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getAllSeasonsRatedByUser } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const season_list = await getAllSeasonsRatedByUser(
    req.db,
    req.query.userId,
    req.query.year ? parseInt(req.query.year, 10) : undefined,
    req.query.beforeScore ? Number(req.query.beforeScore) : undefined,
    req.query.beforeRatedAt ? new Date(req.query.beforeRatedAt) : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ season_list });
});

export default handler;
