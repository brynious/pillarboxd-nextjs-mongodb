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

import { useRouter } from 'next/router';

const DefaultListControllersInner = ({ user, seriesId }) => {
  const [watchlist, setWatchlist] = useState(false);
  const [watching, setWatching] = useState(false);
  const [watched, setWatched] = useState(false);

  const [userScore, setUserScore] = useState(0);

  const dynamicRoute = useRouter().asPath;

  const getRatingOnLoad = async () => {
    const data = await fetcher(
      `/api/user/${user._id}/rating/series/${seriesId}`,
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
      fetcher(`/api/user/rating/series`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seriesId: seriesId, score: newRating }),
      });
    } else if (newRating === null) {
      fetcher(`/api/user/rating/series`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seriesId: seriesId }),
      });
    }
  };

  useEffect(() => {
    const getUserSeriesStatus = async () => {
      const data = await fetcher(
        `/api/user/${user._id}/series_status/${seriesId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      setWatchlist(data?.status?.watchlist);
      setWatching(data?.status?.watching);
      setWatched(data?.status?.watched);
    };

    getUserSeriesStatus().catch(console.error);
  }, [dynamicRoute, seriesId, user._id]);

  const listController = useCallback(
    async (action, list) => {
      try {
        const response = await fetcher(
          `/api/user/${user._id}/series_status/${seriesId}/${list}`,
          {
            method: action,
            headers: { 'Content-Type': 'application/json' },
          }
        );

        setWatchlist(response?.updated_doc?.watchlist);
        setWatching(response?.updated_doc?.watching);
        setWatched(response?.updated_doc?.watched);
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
        {watchlist ? (
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

        {watching ? (
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

        {watched ? (
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
