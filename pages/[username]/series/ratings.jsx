import { findUserByUsername } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { SeriesRatings } from '@/page-components/Ratings/SeriesRatings';
import nc from 'next-connect';
import Head from 'next/head';

export default function UserPage({ user_id, name }) {
  return (
    <>
      <Head>
        <title>{name}&apos;s Series Ratings • Pillarboxd</title>
      </Head>
      <SeriesRatings user_id={user_id} name={name} />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const userData = await findUserByUsername(
    context.req.db,
    context.params.username
  );

  if (!userData) {
    return {
      notFound: true,
    };
  }

  const user_id = String(userData._id);
  const name = userData.name;

  return { props: { user_id, name } };
}
