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
    for (let index = 0; index < user['watched'].length; index++) {
      const initial = user['watched'][index];

      const cursor = await findSeriesById(
        context.req.db,
        user['watched'][index].seriesId
      );
      user['watched'][index] = {
        seriesId: initial.seriesId,
        loggedAt: initial.loggedAt.toJSON(),
        ...cursor,
        _id: cursor._id.toString(),
      };
    }
  }

  user['watchlist'] = '';
  user['watching'] = '';
  user._id = String(user._id);
  return { props: { user } };
}
