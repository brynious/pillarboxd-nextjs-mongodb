import styles from './AllSeries.module.css';
// import { Spacer, Wrapper, Container } from '@/components/Layout';
import { Wrapper } from '@/components/Layout';
import Link from 'next/link';

export const AllSeries = ({ series }) => {
  return (
    <Wrapper className={styles.root}>
      <ul>
        {series.map((tvSeries) => {
          return (
            <li key={tvSeries.tmdb_id}>
              <Link href={`/series/${tvSeries.slug}`}>
                <a>{tvSeries.name}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </Wrapper>
  );
};
