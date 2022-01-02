import { getAllSeries } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import nc from 'next-connect';
import Head from 'next/head';
import Link from 'next/link';

export default function SeriesPage({ series }) {
  return (
    <>
      <Head>
        <title>Series • Pillarboxd</title>
      </Head>

      <ul>
        {series.map((tvSeries) => {
          return (
            <li key={tvSeries.tmdb_id}>
              <Link href={`/series/${tvSeries.slug}`}>
                <a>{tvSeries.name}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const seriesArray = await getAllSeries(context.req.db);

  if (!seriesArray) {
    return {
      notFound: true,
    };
  }

  const series = seriesArray.map((series) => {
    return {
      ...series,
      _id: String(series._id),
    };
  });
  return { props: { series } };
}
