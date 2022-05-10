import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useState } from 'react';
import styles from './ListControllers.module.css';

import Rating from '@mui/material/Rating';
import Star from '@mui/icons-material/Star';

const DefaultListControllersInner = ({ user, episodeId }) => {
  const [userScore, setUserScore] = useState(0);

  const getRatingOnLoad = async () => {
    const data = await fetcher(
      `/api/user/${user._id}/rating/episode/${episodeId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const score = data?.rating?.score;
    setUserScore(score ? score : 0);
  };
  getRatingOnLoad();

  const postRating = (newRating) => {
    setUserScore(newRating);
    if (newRating > 0) {
      fetcher(`/api/user/rating/episode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: episodeId, score: newRating }),
      });
    } else if (newRating === null) {
      fetcher(`/api/user/rating/episode`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: episodeId }),
      });
    }
  };

  return (
    <div>
      <h3 className={styles.heading}>Rating</h3>
      <Rating
        name="simple-controlled"
        precision={0.5}
        value={userScore}
        size="large"
        icon={<Star style={{ color: '#00e054' }} fontSize="large" />}
        emptyIcon={<Star style={{ color: '#334455' }} fontSize="large" />}
        onChange={(event, newRating) => {
          postRating(newRating);
        }}
      />
    </div>
  );
};

const DefaultListControllers = ({ episodeId }) => {
  const { data, error, mutate } = useCurrentUser();
  const loading = !data && !error;

  return (
    <section>
      <div className={styles.root}>
        {loading ? (
          <LoadingDots>Loading</LoadingDots>
        ) : data?.user ? (
          <DefaultListControllersInner
            user={data.user}
            mutate={mutate}
            episodeId={episodeId}
          />
        ) : (
          <Text color="secondary">
            <Link href="/login" passHref>
              <TextLink color="link" variant="highlight">
                Sign in
              </TextLink>
            </Link>{' '}
            to rate and track series.
          </Text>
        )}
      </div>
    </section>
  );
};

export default DefaultListControllers;
