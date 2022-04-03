import { ValidateProps } from '@/api-lib/constants';
import { postEpisodeRating, deleteEpisodeRating } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.use(database);

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      episodeId: ValidateProps.rating.episodeId,
      score: ValidateProps.rating.score,
    },
    required: ['episodeId', 'score'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const dbResponse = await postEpisodeRating(req.db, {
      episodeId: req.body.episodeId,
      score: req.body.score,
      userId: req.user._id,
    });

    return res.json({ dbResponse, message: 'Episode rated' });
  }
);

handler.delete(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      episodeId: ValidateProps.rating.episodeId,
    },
    required: ['episodeId'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const dbResponse = await deleteEpisodeRating(req.db, {
      episodeId: req.body.episodeId,
      score: req.body.score,
      userId: req.user._id,
    });

    return res.json({ dbResponse, message: 'Rating deleted' });
  }
);

export default handler;
