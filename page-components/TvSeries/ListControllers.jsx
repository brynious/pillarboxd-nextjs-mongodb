import { Button } from '@/components/Button';
import { Container } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './ListControllers.module.css';
import { Ribbon, Television, Check } from '@/components/Icons/Icons';

import Rating from './Rating';

const DefaultListControllersInner = ({ user, mutate, seriesId }) => {
  const [isLoading, setIsLoading] = useState(false);

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
      <div>
        <Rating precision={0.5} />
      </div>
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
