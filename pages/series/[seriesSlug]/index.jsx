import { findSeriesBySlug, getSeasonsBySeriesId } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { TvSeries } from '@/page-components/TvSeries';
import nc from 'next-connect';
import Head from 'next/head';

export default function SeriesPage({ series, seasons }) {
  return (
    <>
      <Head>
        <title>{series.name} • Pillarboxd</title>
      </Head>
      <TvSeries series={series} seasons={seasons} />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const series = await findSeriesBySlug(
    context.req.db,
    context.params.seriesSlug
  );

  let seasons = await getSeasonsBySeriesId(context.req.db, series._id);
  if (!series) {
    return {
      notFound: true,
    };
  }
  series._id = String(series._id);
  seasons = seasons.map((season) => {
    return {
      ...season,
      _id: String(season._id),
      series_id: String(season.series_id),
    };
  });
  return { props: { series, seasons } };
}
