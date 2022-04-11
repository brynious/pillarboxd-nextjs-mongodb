import styles from './DefaultList.module.css';
import { Wrapper, Container, Spacer } from '@/components/Layout';
import { useDefaultList } from '@/lib/default_list';
import PosterImage from '@/components/PosterImage/PosterImage';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';

export const DefaultList = ({ user_id, username, list_type }) => {
  const { data, size, setSize, isLoadingMore, isReachingEnd } = useDefaultList({
    user_id,
    list_type,
  });

  const series = data
    ? data.reduce((acc, val) => [...acc, ...val.seriesList], [])
    : [];

  return (
    <Wrapper className={styles.root}>
      <h1>
        {username}&apos;s {list_type[0].toUpperCase() + list_type.slice(1)}
      </h1>

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

      <Spacer size={5} axis="vertical" />
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
