import { findSeriesBySlug } from '@/api-lib/db';
import { findSeasonBySlug } from '@/api-lib/db';

export async function findEpisodeBySlug(
  db,
  seriesSlug,
  seasonSlug,
  episodeSlug
) {
  const series = await findSeriesBySlug(db, seriesSlug);
  const season = await findSeasonBySlug(db, seasonSlug);

  const episode = await db
    .collection('tv_episodes')
    .findOne({
      series_id: series._id,
      season_id: season._id,
      slug: episodeSlug,
    })
    .then((episode) => episode || null);

  return [series, season, episode];
}

export async function getEpisodesBySeasonId(db, season_id) {
  const episodes = [];

  const episodesPromise = db
    .collection('tv_episodes')
    .find({ season_id: season_id });

  while (await episodesPromise.hasNext()) {
    episodes.push(await episodesPromise.next());
  }
  return episodes;
}
