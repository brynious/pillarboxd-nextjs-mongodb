import styles from './AllSeries.module.css';
import { Wrapper, Container } from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w185${src}`;
};

export const AllSeries = ({ series }) => {
  return (
    <Wrapper className={styles.root}>
      <Container flex={true} className={styles.flexContainer}>
        {series.map((tvSeries) => {
          return (
            <div key={tvSeries.tmdb_id} className={styles.imageContainer}>
              <Link href={`/series/${tvSeries.slug}`}>
                <a>
                  <div>
                    <Image
                      loader={backdropLoader}
                      src={tvSeries.poster_path}
                      width={185}
                      height={185 * 1.5}
                      layout="responsive"
                      alt={`${tvSeries.name} backdrop image`}
                      className={styles.image}
                    />
                  </div>
                </a>
              </Link>
            </div>
          );
        })}
      </Container>
    </Wrapper>
  );
};
