import { ValidateProps } from '@/api-lib/constants';
import { postSeriesRating, deleteSeriesRating } from '@/api-lib/db';
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
      seriesId: ValidateProps.rating.seriesId,
      score: ValidateProps.rating.score,
    },
    required: ['seriesId', 'score'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const dbResponse = await postSeriesRating(req.db, {
      seriesId: req.body.seriesId,
      score: req.body.score,
      userId: req.user._id,
    });

    return res.json({ dbResponse, message: 'Series rated' });
  }
);

handler.delete(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      seriesId: ValidateProps.rating.seriesId,
    },
    required: ['seriesId'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const dbResponse = await deleteSeriesRating(req.db, {
      seriesId: req.body.seriesId,
      score: req.body.score,
      userId: req.user._id,
    });

    return res.json({ dbResponse, message: 'Rating deleted' });
  }
);

export default handler;
