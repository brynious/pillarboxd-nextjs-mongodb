import { Button } from '@/components/Button';
import { Container } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './Watchlist.module.css';

const WatchlistInner = ({ user, mutate, seriesId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const addToWatchlist = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const response = await fetcher('/api/user/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        mutate({ user: response.user }, false);
        toast.success('Series added to your Watchlist');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, seriesId]
  );

  const removeFromWatchlist = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const response = await fetcher('/api/user/watchlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        mutate({ user: response.user }, false);
        toast.success('Series removed from your Watchlist');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, seriesId]
  );

  const addToWatching = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const response = await fetcher('/api/user/watching', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        mutate({ user: response.user }, false);
        toast.success('Series added to your Watching');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, seriesId]
  );

  const removeFromWatching = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const response = await fetcher('/api/user/watching', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        mutate({ user: response.user }, false);
        toast.success('Series removed from your Watching');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, seriesId]
  );

  const addToWatched = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const response = await fetcher('/api/user/watched', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        mutate({ user: response.user }, false);
        toast.success('Series added to your Watched list');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, seriesId]
  );

  const removeFromWatched = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const response = await fetcher('/api/user/watched', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        mutate({ user: response.user }, false);
        toast.success('Series removed from your Watched');
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate, seriesId]
  );

  return (
    <Container className={styles.poster}>
      {user.watchlist
        .map((series) => series.seriesId === seriesId)
        .includes(true) ? (
        <Button
          onClick={removeFromWatchlist}
          loading={isLoading}
          type="secondary"
        >
          Remove from Watchlist
        </Button>
      ) : (
        <Button onClick={addToWatchlist} loading={isLoading} type="secondary">
          Add to Watchlist
        </Button>
      )}

      {user.watching
        .map((series) => series.seriesId === seriesId)
        .includes(true) ? (
        <Button
          onClick={removeFromWatching}
          loading={isLoading}
          type="secondary"
        >
          Remove from Watching
        </Button>
      ) : (
        <Button onClick={addToWatching} loading={isLoading} type="secondary">
          Add to Watching
        </Button>
      )}

      {user.watched
        .map((series) => series.seriesId === seriesId)
        .includes(true) ? (
        <Button
          onClick={removeFromWatched}
          loading={isLoading}
          type="secondary"
        >
          Remove from Watched
        </Button>
      ) : (
        <Button onClick={addToWatched} loading={isLoading} type="secondary">
          Add to Watched
        </Button>
      )}
    </Container>
  );
};

const Watchlist = ({ seriesId }) => {
  const { data, error, mutate } = useCurrentUser();
  const loading = !data && !error;

  return (
    <section className={styles.listContainer}>
      <div className={styles.root}>
        <h3 className={styles.heading}>Your lists</h3>
        {loading ? (
          <LoadingDots>Loading</LoadingDots>
        ) : data?.user ? (
          <WatchlistInner
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

export default Watchlist;
