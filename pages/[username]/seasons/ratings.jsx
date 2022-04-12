import { findUserByUsername } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { SeasonRatings } from '@/page-components/Ratings/SeasonRatings';
import nc from 'next-connect';
import Head from 'next/head';

export default function UserPage({ user_id, name }) {
  return (
    <>
      <Head>
        <title>{name}&apos;s Season Ratings • Pillarboxd</title>
      </Head>
      <SeasonRatings user_id={user_id} name={name} />
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
