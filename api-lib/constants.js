export const ValidateProps = {
  user: {
    username: { type: 'string', minLength: 4, maxLength: 20 },
    name: { type: 'string', minLength: 1, maxLength: 50 },
    password: { type: 'string', minLength: 8 },
    email: { type: 'string', minLength: 1 },
    bio: { type: 'string', minLength: 0, maxLength: 160 },
  },
  post: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
  comment: {
    content: { type: 'string', minLength: 1, maxLength: 280 },
  },
  watchlist: {
    seriesId: { type: 'string', minLength: 10, maxLength: 20 },
  },
  rating: {
    seriesId: { type: 'string', minLength: 10, maxLength: 25 },
    score: { type: 'number', minimum: 0.5, maximum: 5 },
  },
};
