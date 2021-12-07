export const TvSeries = ({ series }) => {
  return (
    <div>
      <h1>{series.name}</h1>
      <p>{series.tagline}</p>
      <p>{series.overview}</p>
    </div>
  );
};
