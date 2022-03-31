import { Container } from '@/components/Layout';
import styles from './WatchlistSection.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const WatchlistSection = ({ user }) => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Container className={styles.root} column alignItems="center">
      <div>
        {user.watchlist.map((watchlistSeries, index) => {
          return <div key={index}>{watchlistSeries.name}</div>;
        })}
      </div>
      <ul>
        <li>
          <Link href={`/user/${username}/watchlist`}>
            <a>Watchlist</a>
          </Link>
        </li>
        <li>
          <Link href={`/user/${username}/watching`}>
            <a>Watching</a>
          </Link>
        </li>
        <li>
          <Link href={`/user/${username}/watched`}>
            <a>Watched</a>
          </Link>
        </li>
      </ul>
    </Container>
  );
};

export default WatchlistSection;
