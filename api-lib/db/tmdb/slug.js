// const slugify = require('slugify');

const getVerifiedSlug = async (client, collection, seriesData) => {
  const defaultSlug = seriesData.slug;
  const country_code = seriesData.origin_country[0];
  const premiere_year = new Date(seriesData.first_air_date).getFullYear();
  try {
    // use default slug if available
    const slugTaken = await client
      .db('production0')
      .collection(collection)
      .findOne({ slug: defaultSlug });
    if (!slugTaken) {
      return defaultSlug;
    }

    // use existing slug if series is already in DB
    const seriesInDb = await client
      .db('production0')
      .collection(collection)
      .findOne({ tmdb_id: seriesData.tmdb_id });
    if (seriesInDb) {
      return seriesInDb.slug;
    }

    // if slug taken, first add country code
    let slugWithCountry = defaultSlug + '-' + country_code.toLowerCase();
    const slugWithCountryTaken = await client
      .db('production0')
      .collection(collection)
      .findOne({ slug: slugWithCountry });
    if (!slugWithCountryTaken) {
      return slugWithCountry;
    }

    // if slug taken, first add country code
    let slugWithCountryAndDate = slugWithCountry + '-' + premiere_year;
    const slugWithCountryAndDateTaken = await client
      .db('production0')
      .collection(collection)
      .findOne({ slug: slugWithCountryAndDate });
    if (!slugWithCountryAndDateTaken) {
      return slugWithCountryAndDate;
    }

    // if slug still taken, add next available integer to the end
    let validSlugFound = false;
    let suffix = 1;
    while (!validSlugFound) {
      let slugWithSuffix = slugWithCountryAndDate + '-' + suffix.toString();
      const slugWithSuffixTaken = await client
        .db('production0')
        .collection(collection)
        .findOne({ slug: slugWithSuffix });
      if (!slugWithSuffixTaken) {
        validSlugFound = true;
        return slugWithSuffix;
      } else {
        suffix++;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { getVerifiedSlug };
