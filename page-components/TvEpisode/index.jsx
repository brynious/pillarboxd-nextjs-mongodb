import styles from './TvEpisode.module.css';
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

export const TvEpisode = ({ series, season, episode }) => {
  return (
    <Wrapper className={styles.root}>
      <Image
        loader={backdropLoader}
        className={styles.backdropImage}
        layout="fill"
        src={episode.still_path}
        alt="background"
      />
      <Container flex={true}>
        <div className={styles.posterContainer}>
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
            {' - '}
            <Link href={`/series/${series.slug}/${season.slug}`} passHref>
              {season.name}
            </Link>
          </h1>
          <h2>
            {episode.episode_number}. {episode.name}
          </h2>
          <Spacer size={0.5} axis="vertical" />
          {episode.overview ? <p>{episode.overview}</p> : <p>No Overview</p>}
          <section>
            {episode.guest_stars.length > 0 && <h3>Guest Stars</h3>}
            {episode.guest_stars.map((castMember) => {
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
          <ListControllers episodeId={episode._id} />
        </div>
      </Container>
    </Wrapper>
  );
};
