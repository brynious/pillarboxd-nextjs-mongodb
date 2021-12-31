import styles from './TvSeason.module.css';
import { Spacer, Wrapper, Container } from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w500${src}`;
};

export const TvSeason = ({ series, season }) => {
  return (
    <Wrapper className={styles.root}>
      <Container flex={true}>
        <div className={styles.imageContainer}>
          <Image
            loader={backdropLoader}
            src={season.poster_path}
            width={500}
            height={750}
            layout="responsive"
            alt={`${season.name} backdrop image`}
          />
        </div>
        <div>
          <h1>
            {' '}
            <Link href={`/series/${series.slug}`} passHref>
              {series.name}
            </Link>{' '}
            - {season.name}
          </h1>
          <Spacer size={0.5} axis="vertical" />
          <p>{season.tagline}</p>
          <p>{season.overview}</p>
        </div>
      </Container>
    </Wrapper>
  );
};
