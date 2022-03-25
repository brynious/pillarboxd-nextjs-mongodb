import styles from './AllSeries.module.css';
import { Wrapper, Container } from '@/components/Layout';
import PosterImage from '@/components/PosterImage/PosterImage';
import { useAllSeries } from '@/lib/series';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';

export const AllSeries = () => {
  const { data, size, setSize, isLoadingMore, isReachingEnd } = useAllSeries();
  const series = data
    ? data.reduce((acc, val) => [...acc, ...val.seriesList], [])
    : [];

  return (
    <Wrapper className={styles.root}>
      <Container flex={true} className={styles.flexContainer}>
        {series.map((tvSeries) => {
          return (
            <PosterImage
              key={tvSeries.tmdb_id}
              poster_path={tvSeries.poster_path}
              slug={tvSeries.slug}
              name={tvSeries.name}
            />
          );
        })}
      </Container>
      <Container justifyContent="center">
        {isReachingEnd ? (
          <Text color="secondary">No more posts are found</Text>
        ) : (
          <Button
            variant="ghost"
            type="success"
            loading={isLoadingMore}
            onClick={() => setSize(size + 1)}
          >
            Load more
          </Button>
        )}
      </Container>
    </Wrapper>
  );
};
