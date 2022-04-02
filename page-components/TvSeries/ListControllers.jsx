import { Button } from '@/components/Button';
import { Container } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './ListControllers.module.css';
import { Ribbon, Television, Check } from '@/components/Icons/Icons';

import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const DefaultListControllersInner = ({ user, mutate, seriesId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userScore, setUserScore] = useState(-1);

  useEffect(() => {
    const getUsersRatingOnLoad = async () => {
      const data = await fetcher(`/api/user/rating/${seriesId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      setUserScore(data.rating.score);
    };

    getUsersRatingOnLoad().catch(console.error);
  }, []);

  useEffect(() => {
    const uploadRating = async () => {
      if (userScore > 0) {
        await fetcher(`/api/user/rating`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seriesId: seriesId, score: userScore }),
        });
      } else if (userScore === 0) {
        await fetcher(`/api/user/rating`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seriesId: seriesId }),
        });
      }
    };

    uploadRating().catch(console.error);
  }, [userScore]);

  const listController = useCallback(
    async (action, list) => {
      try {
        setIsLoading(true);
        const response = await fetcher(`/api/user/${list}`, {
          method: action,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        mutate({ user: response.user }, false);
        toast.success(response.message);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, seriesId]
  );

  // useCallback(
  //   const updateDB = async (score) => {
  //     try {
  //       const action = score ? 'POST' : 'DELETE';
  //       console.log({ action });
  //       const response = await fetcher(`/api/user/rating`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ seriesId: seriesId, score: score }),
  //       });
  //       toast.success(response.message);
  //     } catch (e) {
  //       toast.error(e.message);
  //     }
  //   },
  //   [userScore]
  // );

  return (
    <div>
      <Container className={styles.controllerContainer}>
        {user.watchlist
          .map((series) => series.seriesId === seriesId)
          .includes(true) ? (
          <Button
            onClick={() => listController('DELETE', 'watchlist')}
            loading={isLoading}
            type="success"
          >
            <Ribbon />
          </Button>
        ) : (
          <Button
            onClick={() => listController('POST', 'watchlist')}
            loading={isLoading}
            type="secondary"
          >
            <Ribbon />
          </Button>
        )}

        {user.watching
          .map((series) => series.seriesId === seriesId)
          .includes(true) ? (
          <Button
            onClick={() => listController('DELETE', 'watching')}
            loading={isLoading}
            type="success"
          >
            <Television />
          </Button>
        ) : (
          <Button
            onClick={() => listController('POST', 'watching')}
            loading={isLoading}
            type="secondary"
          >
            <Television />
          </Button>
        )}

        {user.watched
          .map((series) => series.seriesId === seriesId)
          .includes(true) ? (
          <Button
            onClick={() => listController('DELETE', 'watched')}
            loading={isLoading}
            type="success"
          >
            <Check />
          </Button>
        ) : (
          <Button
            onClick={() => listController('POST', 'watched')}
            loading={isLoading}
            type="secondary"
          >
            <Check />
          </Button>
        )}
      </Container>
      <Typography component="legend">Rating</Typography>
      <Rating
        name="simple-controlled"
        precision={0.5}
        value={userScore}
        size="large"
        onChange={(event, newUserScore) => {
          setUserScore(newUserScore);
        }}
      />
    </div>
  );
};

const DefaultListControllers = ({ seriesId }) => {
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
            seriesId={seriesId}
          />
        ) : (
          <Text color="secondary">
            Please{' '}
            <Link href="/login" passHref>
              <TextLink color="link" variant="highlight">
                Sign in
              </TextLink>
            </Link>{' '}
            to track series
          </Text>
        )}
      </div>
    </section>
  );
};

export default DefaultListControllers;
