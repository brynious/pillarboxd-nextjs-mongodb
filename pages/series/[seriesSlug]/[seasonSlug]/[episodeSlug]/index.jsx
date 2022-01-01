import {
  findSeriesBySlug,
  findSeasonBySlug,
  findEpisodeBySlug,
} from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { TvEpisode } from '@/page-components/TvEpisode';
import nc from 'next-connect';
import Head from 'next/head';

export default function EpisodePage({ series, season, episode }) {
  const seasonNumLeadingZero = String(season.season_number).padStart(2, '0');
  const episodeNumLeadingZero = String(episode.episode_number).padStart(2, '0');
  return (
    <>
      <Head>
        <title>
          {series.name} S{seasonNumLeadingZero}E{episodeNumLeadingZero}{' '}
          {episode.name}
        </title>
      </Head>
      <TvEpisode series={series} season={season} episode={episode} />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const series = await findSeriesBySlug(
    context.req.db,
    context.params.seriesSlug
  );
  const season = await findSeasonBySlug(
    context.req.db,
    series,
    context.params.seasonSlug
  );
  const episode = await findEpisodeBySlug(
    context.req.db,
    series,
    season,
    context.params.episodeSlug
  );

  if (!series || !season || !episode) {
    return {
      notFound: true,
    };
  }

  series._id = String(series._id);
  season._id = String(season._id);
  season.series_id = String(season.series_id);
  episode._id = String(episode._id);
  episode.series_id = String(episode.series_id);
  episode.season_id = String(episode.season_id);

  return { props: { series, season, episode } };
}
