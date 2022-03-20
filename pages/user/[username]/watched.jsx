import { findUserByUsername, findSeriesById } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { DefaultList } from '@/page-components/User/DefaultList';
import nc from 'next-connect';
import Head from 'next/head';

export default function UserPage({ user }) {
  return (
    <>
      <Head>
        <title>{user.name}&apos;s Watched • Pillarboxd</title>
      </Head>
      <DefaultList user={user} listType="watched" />
    </>
  );
}

export async function getServerSideProps(context) {
  await nc().use(database).run(context.req, context.res);

  const user = await findUserByUsername(
    context.req.db,
    context.params.username
  );
  if (!user) {
    return {
      notFound: true,
    };
  } else {
    for (const listType of ['watchlist', 'watching', 'watched']) {
      for (let index = 0; index < user[listType].length; index++) {
        const cursor = await findSeriesById(
          context.req.db,
          user[listType][index].seriesId
        );
        user[listType][index] = {
          ...cursor,
          _id: cursor._id.toString(),
        };
      }
    }
  }
  user._id = String(user._id);
  return { props: { user } };
}
