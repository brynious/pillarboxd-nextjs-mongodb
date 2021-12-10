import styles from './TvSeries.module.css';
import Image from 'next/image';

const backdropLoader = ({ src, width }) => {
  return `https://image.tmdb.org/t/p/original${src}`;
};

export const TvSeries = ({ series }) => {
  return (
    <div>
      <h1>{series.name}</h1>
      <p>{series.tagline}</p>
      <p>{series.overview}</p>
      <div className={styles.imageContainer}>
        <Image
          loader={backdropLoader}
          src={series.backdrop_path}
          width={16}
          height={9}
          layout="responsive"
          alt={`${series.name} backdrop image`}
        />
      </div>
    </div>
  );
};
