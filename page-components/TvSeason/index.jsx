import styles from './TvSeason.module.css';
import { Spacer, Wrapper, Container } from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import ActingCredit from '@/components/Credit/ActingCredit';

import ListControllers from './ListControllers';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/original${src}`;
};

const posterLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w500${src}`;
};

export const TvSeason = ({ series, season, episodes }) => {
  return (
    <Wrapper className={styles.root}>
      <Image
        loader={backdropLoader}
        className={styles.backdropImage}
        layout="fill"
        src={series.backdrop_path}
        alt="background"
      />
      <Container flex={true}>
        <div className={styles.imageContainer}>
          <Image
            loader={posterLoader}
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
          </h1>
          <h2>{season.name}</h2>
          <p>{season.air_date && new Date(season.air_date).getFullYear()}</p>
          <Spacer size={0.5} axis="vertical" />
          {season.overview && <p>{season.overview}</p>}
          <Spacer size={0.5} axis="vertical" />
          <ul>
            {episodes.map((episode) => {
              if (
                season.name.toLowerCase() !== 'specials' ||
                series.approved_specials.includes(episode.tmdb_id)
              )
                return (
                  <li key={episode.tmdb_id}>
                    <Link
                      href={`/series/${series.slug}/${season.slug}/${episode.slug}`}
                    >
                      <a>
                        {episode.episode_number}. {episode.name}
                      </a>
                    </Link>
                  </li>
                );
            })}
          </ul>
          <section>
            {season.cast.length > 1 && <h3>Cast</h3>}
            {season.cast.map((castMember) => {
              return (
                <ActingCredit
                  key={castMember.id}
                  name={castMember.name}
                  role={castMember.character}
                />
              );
            })}
          </section>
          <Spacer size={5} axis="vertical" />
        </div>
        <div>
          <ListControllers seasonId={season._id} />
        </div>
      </Container>
    </Wrapper>
  );
};
