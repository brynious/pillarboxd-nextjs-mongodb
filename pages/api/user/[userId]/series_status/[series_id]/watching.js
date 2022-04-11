import { addToWatching, removeFromWatching } from '@/api-lib/db';
import { auths, database } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.post(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }

  const updated_doc = await addToWatching(req.db, {
    series_id: req.query.series_id,
    user_id: req.user._id,
  });

  return res.json({ updated_doc, message: 'Series added to Watching' });
});

handler.delete(...auths, async (req, res) => {
  if (!req.user) {
    return res.status(401).end();
  }

  const updated_doc = await removeFromWatching(req.db, {
    series_id: req.query.series_id,
    user_id: req.user._id,
  });

  return res.json({ updated_doc, message: 'Series removed from Watching' });
});

export default handler;
