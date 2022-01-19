const seriesArray = require('../../cache/data').series;

export default (req, res) => {
  const results = req.query.q
    ? seriesArray.filter((series) =>
        series.name.toLowerCase().includes(req.query.q.toLowerCase())
      )
    : [];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ results }));
};
