import styles from './Watchlist.module.css';
import { Wrapper, Container } from '@/components/Layout';
import PosterImage from '@/components/PosterImage/PosterImage';

export const Watchlist = ({ user }) => {
  return (
    // <div className={styles.root}>
    //   <p>This is the watchlist page</p>
    //   <p>{user.name}</p>
    // </div>
    <Wrapper className={styles.root}>
      <h1>{user.name}&apos;s Watchlist</h1>
      <Container flex={true} className={styles.flexContainer}>
        {user.watchlist.map((tvSeries) => {
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
