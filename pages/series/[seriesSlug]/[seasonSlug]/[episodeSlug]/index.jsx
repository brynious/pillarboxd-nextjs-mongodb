import { findSeasonBySlug } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { TvEpisode } from '@/page-components/TvEpisode';
import nc from 'next-connect';
import Head from 'next/head';

export default function SeasonPage({ series, season }) {
  return (
    <>
      <Head>
        <title>
          {series.name} - {season.name}
        </title>
      </Head>
      {/* <TvEpisode series={series} season={season} episode={episode} /> */}
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  console.log('context.req', context.req);

  const [series, season] = await findEpisodeBySlug(
    context.req.db,
    context.params.seriesSlug,
    context.params.seasonSlug,
    context.params.episodeSlug
  );
  if (!season) {
    return {
      notFound: true,
    };
  }
  series._id = String(series._id);
  season._id = String(season._id);
  episode._id = String(episode._id);
  episode.series_id = String(episode.series_id);
  episode.series_id = String(episode.season_id);
  return { props: { series, season, episode } };
}
