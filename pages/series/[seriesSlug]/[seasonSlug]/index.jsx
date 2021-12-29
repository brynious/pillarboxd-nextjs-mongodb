import { findSeasonBySlug } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { TvSeason } from '@/page-components/TvSeason';
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
      <TvSeason series={series} season={season} />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  console.log('context.req', context.req);

  const [series, season] = await findSeasonBySlug(
    context.req.db,
    context.params.seriesSlug,
    context.params.seasonSlug
  );
  if (!season) {
    return {
      notFound: true,
    };
  }
  series._id = String(series._id);
  season._id = String(season._id);
  season.series_id = String(season.series_id);
  return { props: { series, season } };
}
