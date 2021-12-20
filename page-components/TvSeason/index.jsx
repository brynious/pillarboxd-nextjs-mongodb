import styles from './TvSeason.module.css';
import Image from 'next/image';
import Link from 'next/link';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w500${src}`;
};

export const TvSeason = ({ series, season }) => {
  return (
    <div>
      <h1>
        {' '}
        <Link href={`/series/${series.slug}`} passHref>
          {series.name}
        </Link>{' '}
        - {season.name}
      </h1>

      <p>{season.tagline}</p>
      <p>{season.overview}</p>
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
    </div>
  );
};
