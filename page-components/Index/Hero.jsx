import { ButtonLink } from '@/components/Button';
import { Container, Spacer, Wrapper } from '@/components/Layout';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <Wrapper>
      <div>
        <h1 className={styles.title}>
          <span className={styles.topline}>Pillarboxd</span>
          <span className={styles.secondarylines}>Social</span>
          <span className={styles.secondarylines}>Television</span>
          <span className={styles.secondarylines}>Discovery</span>
        </h1>
        <Container justifyContent="center" className={styles.buttons}>
          <Container>
            <Link passHref href="/series">
              <ButtonLink className={styles.button}>Explore Series</ButtonLink>
            </Link>
          </Container>
          <Spacer axis="horizontal" size={1} />
          <Container>
            <ButtonLink
              href="https://github.com/brynious/pillarboxd-nextjs-mongodb"
              type="secondary"
              className={styles.button}
            >
              GitHub
            </ButtonLink>
          </Container>
        </Container>
        <p className={styles.subtitle}>
          A Next.js and MongoDB web application for tracking TV shows.
        </p>
      </div>
    </Wrapper>
  );
};

export default Hero;
