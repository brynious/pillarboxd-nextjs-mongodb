import styles from './AllSeries.module.css';
import { Wrapper, Container } from '@/components/Layout';
import PosterImage from '@/components/PosterImage/PosterImage';

export const AllSeries = ({ series }) => {
  const orderedList = series.sort((a, b) => {
    if (a.popularity > b.popularity) {
      return -1;
    }
    if (a.popularity < b.popularity) {
      return 1;
    }
    return 0;
  });

  return (
    <Wrapper className={styles.root}>
      <Container flex={true} className={styles.flexContainer}>
        {orderedList.map((tvSeries) => {
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
    </Wrapper>
  );
};
