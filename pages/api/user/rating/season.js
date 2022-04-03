import { ValidateProps } from '@/api-lib/constants';
import { postSeasonRating, deleteSeasonRating } from '@/api-lib/db';
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
      seasonId: ValidateProps.rating.seasonId,
      score: ValidateProps.rating.score,
    },
    required: ['seasonId', 'score'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const dbResponse = await postSeasonRating(req.db, {
      seasonId: req.body.seasonId,
      score: req.body.score,
      userId: req.user._id,
    });

    return res.json({ dbResponse, message: 'Season rated' });
  }
);

handler.delete(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      seasonId: ValidateProps.rating.seasonId,
    },
    required: ['seasonId'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const dbResponse = await deleteSeasonRating(req.db, {
      seasonId: req.body.seasonId,
      score: req.body.score,
      userId: req.user._id,
    });

    return res.json({ dbResponse, message: 'Rating deleted' });
  }
);

export default handler;
