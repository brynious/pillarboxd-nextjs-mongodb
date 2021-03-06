import styles from './SeriesRatings.module.css';
import { Wrapper, Container, Spacer } from '@/components/Layout';
import { useAllUserSeriesRatings } from '@/lib/ratings';
import PosterImage from '@/components/PosterImage/PosterImage';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import Rating from '@mui/material/Rating';
import Star from '@mui/icons-material/Star';

export const SeriesRatings = ({ user_id, name }) => {
  const { data, size, setSize, isLoadingMore, isReachingEnd } =
    useAllUserSeriesRatings({ user_id });

  const series = data
    ? data.reduce((acc, val) => [...acc, ...val.seriesList], [])
    : [];

  return (
    <Wrapper className={styles.root}>
      <Spacer size={2} axis="vertical" />
      <h1>{name}&apos;s Ratings</h1>
      <Container flex={true} className={styles.flexContainer}>
        {series.map((tvSeries) => {
          return (
            <div key={tvSeries.tmdb_id}>
              <PosterImage
                poster_path={tvSeries.poster_path}
                slug={tvSeries.slug}
                name={tvSeries.name}
              />
              <Rating
                name="read-only"
                precision={0.5}
                value={tvSeries.score}
                icon={<Star style={{ color: '#00e054' }} fontSize="small" />}
                emptyIcon={
                  <Star
                    style={{ color: 'var(--background)' }}
                    fontSize="small"
                  />
                }
                readOnly
              />
            </div>
          );
        })}
      </Container>

      <Spacer size={2} axis="vertical" />
      <Container justifyContent="center">
        {isReachingEnd ? (
          <Text color="secondary">End of list</Text>
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
      <Spacer size={2} axis="vertical" />
    </Wrapper>
  );
};
