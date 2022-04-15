import styles from './UserSeasons.module.css';
import { Wrapper, Container, Spacer } from '@/components/Layout';
import { useUserSeasonsByYear } from '@/lib/seasons';
import PosterImage from '@/components/PosterImage/PosterImage';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import Rating from '@mui/material/Rating';
import Star from '@mui/icons-material/Star';
import { useRouter } from 'next/router';

import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const UserSeasons = ({ user_id, name }) => {
  const router = useRouter();

  const [year, setYear] = useState(router.query);

  const handleChange = (event) => {
    setYear(event.target.value);
  };

  const { data, size, setSize, isLoadingMore, isReachingEnd } =
    useUserSeasonsByYear({ user_id, year: year });

  const seasons = data
    ? data.reduce((acc, val) => [...acc, ...val.season_list], [])
    : [];

  return (
    <Wrapper className={styles.root}>
      <Spacer size={2} axis="vertical" />
      <Container flex={true} className={styles.headingContainer}>
        <h1>{name}&apos;s Seasons</h1>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={handleChange}
            >
              <MenuItem value={2018}>2018</MenuItem>
              <MenuItem value={2019}>2019</MenuItem>
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Container>

      <Container flex={true} className={styles.flexContainer}>
        {seasons.map((tv_season) => {
          return (
            <div key={tv_season.tmdb_id}>
              <PosterImage
                key={tv_season.tmdb_id}
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
          <Text color="secondary">No more posts are found</Text>
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
