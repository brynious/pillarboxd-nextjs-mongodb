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
import Star from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';

import { useRouter } from 'next/router';

const DefaultListControllersInner = ({ user, mutate, seriesId }) => {
  const [userScore, setUserScore] = useState(null);
  const [firstRenderComplete, setFirstRenderComplete] = useState(false);

  const dynamicRoute = useRouter().asPath;

  useEffect(() => {
    const getUsersRatingOnLoad = async () => {
      const data = await fetcher(
        `/api/user/${user._id}/rating/series/${seriesId}`,
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
  }, [dynamicRoute, seriesId, user._id]);

  useEffect(() => {
    if (!firstRenderComplete) return;

    const uploadRating = async () => {
      if (userScore > 0) {
        await fetcher(`/api/user/rating/series`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seriesId: seriesId, score: userScore }),
        });
      } else if (userScore === null) {
        await fetcher(`/api/user/rating/series`, {
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
        const response = await fetcher(`/api/user/${list}`, {
          method: action,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        console.log({ response });
        // mutate({ user: response.user }, false);
        toast.success(response.message);
      } catch (e) {
        toast.error(e.message);
      }
    },
    [seriesId]
  );

  return (
    <div>
      <Container className={styles.controllerContainer}>
        {user.watchlist
          .map((series) => series.seriesId === seriesId)
          .includes(true) ? (
          <Button
            onClick={() => listController('DELETE', 'watchlist')}
            type="success"
          >
            <Ribbon />
          </Button>
        ) : (
          <Button
            onClick={() => listController('POST', 'watchlist')}
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
            type="success"
          >
            <Television />
          </Button>
        ) : (
          <Button
            onClick={() => listController('POST', 'watching')}
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
            type="success"
          >
            <Check />
          </Button>
        ) : (
          <Button
            onClick={() => listController('POST', 'watched')}
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
        icon={<Star style={{ color: '#00e054' }} fontSize="large" />}
        emptyIcon={<Star style={{ color: '#334455' }} fontSize="large" />}
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
