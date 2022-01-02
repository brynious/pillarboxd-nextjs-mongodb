export async function findEpisodeBySlug(db, series, season, episodeSlug) {
  const episode = await db
    .collection('tv_episodes')
    .findOne({
      series_id: series._id,
      season_id: season._id,
      slug: episodeSlug,
    })
    .then((episode) => episode || null);

  return episode;
}

export async function getEpisodesBySeasonId(db, season_id) {
  const cursor = db.collection('tv_episodes').find({ season_id: season_id });
  const allEpisodes = await cursor.toArray();
  return allEpisodes;
}
