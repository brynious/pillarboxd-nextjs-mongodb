import { ValidateProps } from '@/api-lib/constants';
import {
  findPosts,
  insertToWatching,
  deleteFromWatching,
  deleteFromWatchlist,
} from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.get(async (req, res) => {
  const posts = await findPosts(
    req.db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  res.json({ posts });
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

    await deleteFromWatchlist(req.db, {
      content: req.body.content,
      creatorId: req.user._id,
    });

    const user = await insertToWatching(req.db, {
      content: req.body.content,
      creatorId: req.user._id,
    });

    return res.json({ user });
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

    const user = await deleteFromWatching(req.db, {
      content: req.body.content,
      creatorId: req.user._id,
    });

    return res.json({ user });
  }
);

export default handler;
