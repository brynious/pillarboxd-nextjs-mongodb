import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './ListControllers.module.css';

import Rating from '@mui/material/Rating';
import Star from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';

import { useRouter } from 'next/router';

const DefaultListControllersInner = ({ user, episodeId }) => {
  const [userScore, setUserScore] = useState(-1);

  const dynamicRoute = useRouter().asPath;
  useEffect(() => {
    const getUsersRatingOnLoad = async () => {
      setUserScore(-1);
      const data = await fetcher(
        `/api/user/${user._id}/rating/episode/${episodeId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const score = data.rating.score;
      setUserScore(score ? score : -1);
    };

    getUsersRatingOnLoad().catch(console.error);
  }, [dynamicRoute, episodeId, user._id]);

  useEffect(() => {
    const uploadRating = async () => {
      if (userScore > 0) {
        await fetcher(`/api/user/rating/episode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episodeId: episodeId, score: userScore }),
        });
      } else if (userScore === null) {
        await fetcher(`/api/user/rating/episode`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episodeId: episodeId }),
        });
      }
    };

    uploadRating().catch(console.error);
  }, [userScore, episodeId]);

  return (
    <div>
      <Typography component="legend">Rating</Typography>
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

const DefaultListControllers = ({ episodeId }) => {
  const { data, error, mutate } = useCurrentUser();
  const loading = !data && !error;

  return (
    <section>
      <div className={styles.root}>
        <h3 className={styles.heading}>Your lists</h3>
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
