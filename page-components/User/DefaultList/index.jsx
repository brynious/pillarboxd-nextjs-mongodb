import styles from './DefaultList.module.css';
import { Wrapper, Container } from '@/components/Layout';
import PosterImage from '@/components/PosterImage/PosterImage';

export const DefaultList = ({ user, listType }) => {
  const seriesList = user[listType];
  const orderedList = seriesList.sort((a, b) => {
    if (a.loggedAt > b.loggedAt) {
      return -1;
    }
    if (a.loggedAt < b.loggedAt) {
      return 1;
    }
    return 0;
  });

  return (
    <Wrapper className={styles.root}>
      <h1>
        {user.name}&apos;s {listType[0].toUpperCase() + listType.slice(1)}
      </h1>

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
