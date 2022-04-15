import Link from 'next/link';
import styles from './PosterImage.module.css';
import Image from 'next/image';

const backdropLoader = ({ src }) => {
  return `https://image.tmdb.org/t/p/w300${src}`;
};

const PosterImage = ({ poster_path, slug, alt }) => {
  return (
    <div className={styles.imageContainer}>
      {slug ? (
        <Link href={`/series/${slug}`}>
          <a>
            <div>
              <Image
                loader={backdropLoader}
                src={poster_path}
                width={185}
                height={185 * 1.5}
                layout="responsive"
                alt={alt}
                className={styles.image}
              />
            </div>
          </a>
        </Link>
      ) : (
        <div>
          <Image
            loader={backdropLoader}
            src={poster_path}
            width={185}
            height={185 * 1.5}
            layout="responsive"
            alt={alt}
            className={styles.image}
          />
        </div>
      )}
    </div>
  );
};

export default PosterImage;
