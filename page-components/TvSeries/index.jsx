import styles from './TvSeries.module.css';
import { Spacer, Wrapper, Container } from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w500${src}`;
};

export const TvSeries = ({ series, seasons }) => {
  return (
    <Wrapper className={styles.root}>
      <Container flex={true}>
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
        <div>
          <h1>{series.name}</h1>
          <p>{series.tagline}</p>
          <p>{series.overview}</p>
          <Spacer size={0.5} axis="vertical" />
          <h3>Seasons</h3>
          <ul>
            {seasons
              .filter((season) => season.name.toLowerCase() !== 'specials')
              .map((season) => {
                return (
                  <li key={season.tmdb_id}>
                    <Link href={`/series/${series.slug}/${season.slug}`}>
                      {season.name}
                    </Link>
                  </li>
                );
              })}
            {seasons
              .filter((season) => season.name.toLowerCase() === 'specials')
              .map((season) => {
                return (
                  <li key={season.tmdb_id}>
                    <Link href={`/series/${series.slug}/${season.slug}`}>
                      {season.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
          <section>
            <h3>Cast</h3>
            {series.cast.map((castMember) => {
              return (
                <p key={castMember.id}>
                  {castMember.name} as {castMember.character}
                </p>
              );
            })}
          </section>
        </div>
      </Container>
    </Wrapper>
  );
};
