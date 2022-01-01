import { findSeriesBySlug, findSeasonBySlug } from '@/api-lib/db';
import { getEpisodesBySeasonId } from '@/api-lib/db/episode';
import { database } from '@/api-lib/middlewares';
import { TvSeason } from '@/page-components/TvSeason';
import nc from 'next-connect';
import Head from 'next/head';

export default function SeasonPage({ series, season, episodes }) {
  return (
    <>
      <Head>
        <title>
          {series.name} - {season.name}
        </title>
      </Head>
      <TvSeason series={series} season={season} episodes={episodes} />
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

  if (!season) {
    return {
      notFound: true,
    };
  }

  const episodesArray = await getEpisodesBySeasonId(context.req.db, season._id);
  const episodes = episodesArray.map((episode) => {
    return {
      ...episode,
      _id: String(episode._id),
      season_id: String(episode.season_id),
      series_id: String(episode.series_id),
    };
  });

  series._id = String(series._id);
  season._id = String(season._id);
  season.series_id = String(season.series_id);
  return { props: { series, season, episodes } };
}
