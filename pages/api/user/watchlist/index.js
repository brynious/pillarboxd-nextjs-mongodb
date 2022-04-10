import { ValidateProps } from '@/api-lib/constants';
import {
  getUserSeriesStatus,
  insertToDefaultList,
  deleteFromWatchlist,
} from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const series_status = await getUserSeriesStatus(req.db, {
    series_id: req.body.content,
    user_id: req.user._id,
  });

  res.json({ series_status });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.post.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const user = await insertToDefaultList(req.db, {
      series_id: req.body.content,
      user_id: req.user._id,
      default_list: 'watchlist',
    });

    return res.json({ user, message: 'Series added to Watchlist' });
  }
);

handler.delete(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.post.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const user = await deleteFromWatchlist(req.db, {
      content: req.body.content,
      creatorId: req.user._id,
    });

    return res.json({ user, message: 'Series removed from Watchlist' });
  }
);

export default handler;
