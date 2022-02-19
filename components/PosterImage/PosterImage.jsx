import Link from 'next/link';
import styles from './PosterImage.module.css';
import Image from 'next/image';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w185${src}`;
};

const PosterImage = ({ poster_path, slug, name }) => {
  return (
    <div className={styles.imageContainer}>
      <Link href={`/series/${slug}`}>
        <a>
          <div>
            <Image
              loader={backdropLoader}
              src={poster_path}
              width={185}
              height={185 * 1.5}
              layout="responsive"
              alt={`${name} backdrop image`}
              className={styles.image}
            />
          </div>
        </a>
      </Link>
    </div>
  );
};

export default PosterImage;
