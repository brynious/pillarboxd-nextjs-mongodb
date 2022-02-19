import styles from './AllSeries.module.css';
import { Wrapper, Container } from '@/components/Layout';
import PosterImage from '@/components/PosterImage/PosterImage';

export const AllSeries = ({ series }) => {
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
    </Wrapper>
  );
};
