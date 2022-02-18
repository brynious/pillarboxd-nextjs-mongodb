import { Container } from '@/components/Layout';
import styles from './Watchlist.module.css';

const Watchlist = ({ user }) => {
  return (
    <Container className={styles.root} column alignItems="center">
      <div>
        {user.watchlist.map((watchlistSeries, index) => {
          return <div key={index}>{watchlistSeries.name}</div>;
        })}
      </div>
      <p>{user.bio}</p>
      <p>{user.seriesName}</p>
    </Container>
  );
};

export default Watchlist;
