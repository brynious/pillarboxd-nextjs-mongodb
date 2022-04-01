const seriesArray = require('../../cache/data').series;

const search = (req, res) => {
  const results = req.query.q
    ? seriesArray.filter((series) =>
        series.name.toLowerCase().includes(req.query.q.toLowerCase())
      )
    : [];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ results }));
};

export default search;
