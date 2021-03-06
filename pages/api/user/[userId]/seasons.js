import { database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';
import { getAllUsersSeasons } from '@/api-lib/db';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const season_list = await getAllUsersSeasons(
    req.db,
    req.query.userId,
    req.query.year,
    req.query.before ? req.query.before : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ season_list });
});

export default handler;
