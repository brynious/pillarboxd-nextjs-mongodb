import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from './user';

export async function findPostById(db, id) {
  const posts = await db
    .collection('posts')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
  if (!posts[0]) return null;
  return posts[0];
}

export async function findPosts(db, before, by, limit = 10) {
  return db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
}

export async function insertPost(db, { content, creatorId }) {
  const post = {
    content,
    creatorId,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('posts').insertOne(post);
  post._id = insertedId;
  return post;
}

export async function insertWatchlist(db, { content, creatorId }) {
  const watchlistItem = {
    seriesId: content,
    loggedAt: new Date(),
  };

  const userId = ObjectId(creatorId);

  const updatedUser = await db
    .collection('users')
    .findOneAndUpdate(
      { _id: userId },
      { $push: { watchlist: watchlistItem } },
      { returnDocument: 'after', projection: { password: 0 } }
    );

  return updatedUser.value;
}

export async function deleteSeriesFromWatchlist(db, { content, creatorId }) {
  const userId = ObjectId(creatorId);

  console.log('test here');

  const updatedUser = await db
    .collection('users')
    .findOneAndUpdate(
      { _id: userId },
      { $pull: { watchlist: { seriesId: content } } },
      { returnDocument: 'after', projection: { password: 0 } }
    );

  return updatedUser.value;
}
