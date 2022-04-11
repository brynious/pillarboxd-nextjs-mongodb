import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './ListControllers.module.css';

import Rating from '@mui/material/Rating';
import Star from '@mui/icons-material/Star';

import { useRouter } from 'next/router';

const DefaultListControllersInner = ({ user, seasonId }) => {
  const [userScore, setUserScore] = useState(null);
  const [firstRenderComplete, setFirstRenderComplete] = useState(false);

  const dynamicRoute = useRouter().asPath;

  useEffect(() => {
    const getUsersRatingOnLoad = async () => {
      setUserScore(-1);
      const data = await fetcher(
        `/api/user/${user._id}/rating/season/${seasonId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const score = data?.rating?.score;
      setUserScore(score ? score : null);
      setFirstRenderComplete(true);
    };

    getUsersRatingOnLoad().catch(console.error);
  }, [dynamicRoute, seasonId, user._id]);

  useEffect(() => {
    if (!firstRenderComplete) return;

    const uploadRating = async () => {
      if (userScore > 0) {
        await fetcher(`/api/user/rating/season`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seasonId: seasonId, score: userScore }),
        });
      } else if (userScore === null) {
        await fetcher(`/api/user/rating/season`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seasonId: seasonId }),
        });
      }
    };

    uploadRating().catch(console.error);
  }, [userScore, seasonId]);

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
        onChange={(event, newUserScore) => {
          setUserScore(newUserScore);
        }}
      />
    </div>
  );
};

const DefaultListControllers = ({ seasonId }) => {
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
            seasonId={seasonId}
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
