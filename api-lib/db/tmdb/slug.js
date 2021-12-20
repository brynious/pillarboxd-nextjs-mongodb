// const slugify = require('slugify');

const getVerifiedSlug = async (
  client,
  collection,
  defaultSlug,
  country_code,
  premiere_year
) => {
  try {
    // check if there's a series in DB with this slug already
    const slugTaken = await client
      .db('production0')
      .collection(collection)
      .findOne({ slug: defaultSlug });
    if (!slugTaken) {
      return defaultSlug;
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
