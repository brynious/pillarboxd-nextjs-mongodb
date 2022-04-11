import { Container } from '@/components/Layout';
import styles from './DefaultLists.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Ribbon, Television, Check } from '@/components/Icons/Icons';
import Star from '@mui/icons-material/Star';

const DefaultLists = ({ user }) => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Container flex={true} className={styles.root} alignItems="center">
      <Link href={`/user/${username}/watchlist`}>
        <a>
          <Ribbon className="blockCenter" />
        </a>
      </Link>

      <Link href={`/user/${username}/watching`}>
        <a>
          <Television />
        </a>
      </Link>

      <Link href={`/user/${username}/watched`}>
        <a>
          <Check />
        </a>
      </Link>

      <Link href={`/user/${username}/ratings`}>
        <a className="blockCenter">
          <Star />
        </a>
      </Link>
    </Container>
  );
};

export default DefaultLists;
