import styles from './SeasonRatings.module.css';
import { Wrapper, Container, Spacer } from '@/components/Layout';
import { useAllUserSeasonRatings } from '@/lib/ratings';
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

export const SeasonRatings = ({ user_id, name }) => {
  const router = useRouter();

  const [year, setYear] = useState(router.query.year);

  const handleChange = (event) => {
    router.query.year = event.target.value;
    router.push(router);
    setYear(event.target.value);
  };

  const { data, size, setSize, isLoadingMore, isReachingEnd } =
    useAllUserSeasonRatings({ user_id, year });

  const seasons = data
    ? data.reduce((acc, val) => [...acc, ...val.season_list], [])
    : [];

  return (
    <Wrapper className={styles.root}>
      <Spacer size={2} axis="vertical" />

      <Container flex={true} className={styles.headingContainer}>
        <h1>{name}&apos;s Season Ratings</h1>
        <Box sx={{ minWidth: 120 }} className={styles.box}>
          <FormControl fullWidth>
            <InputLabel
              className={styles.inputLabel}
              id="demo-simple-select-label"
            >
              Year
            </InputLabel>
            <Select
              className={styles.select}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={handleChange}
            >
              <MenuItem value={null}>All Years</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2019}>2019</MenuItem>
              <MenuItem value={2018}>2018</MenuItem>
              <MenuItem value={2017}>2017</MenuItem>
              <MenuItem value={2016}>2016</MenuItem>
              <MenuItem value={2015}>2015</MenuItem>
              <MenuItem value={2014}>2014</MenuItem>
              <MenuItem value={2013}>2013</MenuItem>
              <MenuItem value={2012}>2012</MenuItem>
              <MenuItem value={2011}>2011</MenuItem>
              <MenuItem value={2010}>2010</MenuItem>
              <MenuItem value={2009}>2009</MenuItem>
              <MenuItem value={2008}>2008</MenuItem>
              <MenuItem value={2007}>2007</MenuItem>
              <MenuItem value={2006}>2006</MenuItem>
              <MenuItem value={2005}>2005</MenuItem>
              <MenuItem value={2004}>2004</MenuItem>
              <MenuItem value={2003}>2003</MenuItem>
              <MenuItem value={2002}>2002</MenuItem>
              <MenuItem value={2001}>2001</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
