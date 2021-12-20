import styles from './TvSeries.module.css';
import Image from 'next/image';
import Link from 'next/link';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w500${src}`;
};

export const TvSeries = ({ series, seasons }) => {
  console.log(seasons);
  return (
    <div>
      <h1>{series.name}</h1>
      <p>{series.tagline}</p>
      <p>{series.overview}</p>
      <div className={styles.imageContainer}>
        <Image
          loader={backdropLoader}
          src={series.poster_path}
          width={500}
          height={750}
          layout="responsive"
          alt={`${series.name} backdrop image`}
        />
      </div>
      <ul>
        {seasons.map((season) => {
          return (
            <li key={season.tmdb_id}>
              <Link href={`/series/${series.slug}/${season.slug}`}>
                {season.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
