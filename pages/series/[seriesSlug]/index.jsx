import { findSeriesBySlug } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { TvSeries } from '@/page-components/TvSeries';
import nc from 'next-connect';
import Head from 'next/head';

export default function SeriesPage({ series }) {
  return (
    <>
      <Head>
        <title>{series.name}</title>
      </Head>
      <TvSeries series={series} />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const series = await findSeriesBySlug(
    context.req.db,
    context.params.seriesSlug
  );
  if (!series) {
    return {
      notFound: true,
    };
  }
  series._id = String(series._id);
  return { props: { series } };
}
