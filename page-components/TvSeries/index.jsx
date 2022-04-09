import styles from './TvSeries.module.css';
import { Spacer, Wrapper, Container } from '@/components/Layout';
import PosterImage from '@/components/PosterImage/PosterImage';
import ActingCredit from '@/components/Credit/ActingCredit';
import { useCurrentUser } from '@/lib/user';
import Image from 'next/image';

import ListControllers from './ListControllers';

export const TvSeries = ({ series, seasons }) => {
  const { data: { user } = {} } = useCurrentUser();

  const premiere_year = new Date(series.first_air_date).getFullYear();
  const final_year = new Date(series.last_air_date).getFullYear();

  const backdropLoader = ({ src }) => {
    return `https://image.tmdb.org/t/p/original${src}`;
  };

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
          <PosterImage
            key={series.tmdb_id}
            poster_path={series.poster_path}
            slug={null}
            alt={`${series.name} backdrop image`}
          />
        </div>
        <div>
          <h1>{series.name}</h1>
          <p>
            {premiere_year && premiere_year}
            {series.status === 'Ended' && ` - ${final_year}`}
          </p>
          <p>{series.tagline}</p>
          <p>{series.overview}</p>
          <Spacer size={0.5} axis="vertical" />

          {user
            ? user.watchlist.includes(series._id) && 'Series in watchlist.'
            : 'Login to add to watchlist'}

          <Spacer size={0.5} axis="vertical" />
          <h3>Seasons</h3>

          <Container flex={true} className={styles.flexContainer}>
            {seasons
              .filter((season) => season.name.toLowerCase() !== 'specials')
              .map((season) => {
                return (
                  <PosterImage
                    key={season.tmdb_id}
                    poster_path={season.poster_path}
                    slug={`${series.slug}/${season.slug}`}
                    name={season.name}
                  />
                );
              })}
            {series.approved_specials.length > 0 &&
              seasons
                .filter((season) => season.name.toLowerCase() === 'specials')
                .map((season) => {
                  return (
                    <PosterImage
                      key={season.tmdb_id}
                      poster_path={season.poster_path}
                      slug={`${series.slug}/${season.slug}`}
                      name={season.name}
                    />
                  );
                })}
          </Container>

          <section>
            {series.cast.length > 1 && <h3>Cast</h3>}
            {series.cast.map((castMember) => {
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
          {user ? (
            <ListControllers seriesId={series._id} />
          ) : (
            'Login to add to watchlist'
          )}
        </div>
      </Container>
    </Wrapper>
  );
};
