export async function findSeriesBySlug(db, slug) {
  return db
    .collection('tv_series')
    .findOne({ slug })
    .then((series) => series || null);
}
