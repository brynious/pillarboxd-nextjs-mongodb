import styles from './SeasonRatings.module.css';
import { Wrapper, Container, Spacer } from '@/components/Layout';
import { useAllUserSeasonRatings } from '@/lib/ratings';
import PosterImage from '@/components/PosterImage/PosterImage';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import Rating from '@mui/material/Rating';
import Star from '@mui/icons-material/Star';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export const SeasonRatings = ({ user_id, name }) => {
  const router = useRouter();

  const [year, setYear] = useState(router.query.year);

  const handleChange = (event) => {
    if (event.target.value === 'All Years') {
      delete router.query.year;
      router.push(router);
      setYear(null);
    } else {
      router.query.year = event.target.value;
      router.push(router);
      setYear(event.target.value);
    }
  };

  useEffect(() => {
    if (router.query.year) {
      setYear(router.query.year);
    }
  }, [router]);

  const { data, size, setSize, isLoadingMore, isReachingEnd } =
    useAllUserSeasonRatings({ user_id, year });

  const seasons = data
    ? data.reduce((acc, val) => [...acc, ...val.season_list], [])
    : [];

  const availableYears = () => {
    let years = [];
    const currentYear = new Date().getFullYear();
    for (let yearOption = currentYear; yearOption >= 2000; yearOption--) {
      years.push(yearOption);
    }
    return years;
  };

  return (
    <Wrapper className={styles.root}>
      <Spacer size={2} axis="vertical" />

      <Container flex={true} className={styles.headingContainer}>
        <h1>{name}&apos;s Season Ratings</h1>
        <select
          className={styles.select}
          id="demo-simple-select"
          onChange={handleChange}
        >
          <option value={null}>All Years</option>
          {availableYears().map((yearOption) => {
            return (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            );
          })}
        </select>
      </Container>

      <Container flex={true} className={styles.flexContainer}>
        {seasons.map((tv_season) => {
          return (
            <div key={tv_season.tmdb_id}>
              <PosterImage
                poster_path={tv_season.poster_path}
                slug={`${tv_season.series_slug}/${tv_season.season_slug}`}
                name={tv_season.name}
              />
              <Rating
                name="read-only"
                precision={0.5}
                value={tv_season.score}
                icon={<Star style={{ color: '#00e054' }} fontSize="small" />}
                emptyIcon={
                  <Star
                    style={{ color: 'var(--background)' }}
                    fontSize="small"
                  />
                }
                readOnly
              />
            </div>
          );
        })}
      </Container>

      <Spacer size={2} axis="vertical" />
      <Container justifyContent="center">
        {isReachingEnd ? (
          <Text color="secondary">End of list</Text>
        ) : (
          <Button
            variant="ghost"
            type="success"
            loading={isLoadingMore}
            onClick={() => setSize(size + 1)}
          >
            Load more
          </Button>
        )}
      </Container>
      <Spacer size={2} axis="vertical" />
    </Wrapper>
  );
};
