import styles from './TvEpisode.module.css';
import { Spacer, Wrapper, Container } from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w500${src}`;
};

export const TvEpisode = ({ series, season, episode }) => {
  return (
    <Wrapper className={styles.root}>
      <Container flex={true}>
        <div className={styles.posterContainer}>
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
            <Link href={`/series/${series.slug}`} passHref>
              {series.name}
            </Link>
            {' - '}
            <Link href={`/series/${season.slug}`} passHref>
              {season.name}
            </Link>
            {' - '}
            {episode.episode_number}. {episode.name}
          </h1>
          <Spacer size={0.5} axis="vertical" />
          <p>{season.tagline}</p>
          <p>{episode.overview}</p>
        </div>
      </Container>
    </Wrapper>
  );
};
