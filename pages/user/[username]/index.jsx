import { findUserByUsername, findSeriesById } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { User } from '@/page-components/User';
import nc from 'next-connect';
import Head from 'next/head';

export default function UserPage({ user }) {
  return (
    <>
      <Head>
        <title>{user.name}&apos;s Profile • Pillarboxd</title>
      </Head>
      <User user={user} />
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
    for (let index = 0; index < user.watchlist.length; index++) {
      const cursor = await findSeriesById(
        context.req.db,
        user.watchlist[index]
      );
      user.watchlist[index] = {
        ...cursor,
        _id: cursor._id.toString(),
      };
    }
  }
  user._id = String(user._id);
  return { props: { user } };
}
