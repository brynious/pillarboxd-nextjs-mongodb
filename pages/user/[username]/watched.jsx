import { findUserByUsername } from '@/api-lib/db';
import { database } from '@/api-lib/middlewares';
import { DefaultList } from '@/page-components/User/DefaultList';
import nc from 'next-connect';
import Head from 'next/head';

export default function UserPage({ user_id, username, list_type }) {
  return (
    <>
      <Head>
        <title>{username}&apos;s Watched • Pillarboxd</title>
      </Head>
      <DefaultList
        user_id={user_id}
        username={username}
        list_type={list_type}
      />
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
  }

  const user_id = String(user._id);
  const username = user.name;
  const list_type = 'watched';

  return { props: { user_id, username, list_type } };
}
