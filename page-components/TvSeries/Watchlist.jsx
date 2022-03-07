import { Button } from '@/components/Button';
import { Container, Wrapper } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { usePostPages } from '@/lib/post';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useCallback, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import styles from './Watchlist.module.css';

const WatchlistInner = ({ user, seriesId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = usePostPages();

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await fetcher('/api/user/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: seriesId }),
        });
        toast.success('You have posted successfully');
        // refresh post lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return (
    <Container className={styles.poster}>
      {user.watchlist
        .map((series) => series.seriesId === seriesId)
        .includes(true) ? (
        'Series in watchlist.'
      ) : (
        <Button onClick={onSubmit} loading={isLoading} type="secondary">
          Add to Watchlist
        </Button>
      )}
    </Container>
  );
};

const Watchlist = ({ seriesId }) => {
  const { data, error } = useCurrentUser();
  const loading = !data && !error;

  return (
    <section className={styles.listContainer}>
      <div className={styles.root}>
        <h3 className={styles.heading}>Your lists</h3>
        {loading ? (
          <LoadingDots>Loading</LoadingDots>
        ) : data?.user ? (
          <WatchlistInner user={data.user} seriesId={seriesId} />
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
