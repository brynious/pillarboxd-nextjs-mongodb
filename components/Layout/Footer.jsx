import { Text, TextLink } from '@/components/Text';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import styles from './Footer.module.css';
import Spacer from './Spacer';
import Wrapper from './Wrapper';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Wrapper>
        <Text>
          Created by{' '}
          <TextLink href="https://github.com/" color="link">
            Bryn McIvor
          </TextLink>
        </Text>
        <Text color="accents-7">
          Based on{' '}
          <TextLink
            href="https://github.com/hoangvvo/nextjs-mongodb-app"
            color="link"
          >
            the template
          </TextLink>{' '}
          created with ❤️, 🔥, and a keyboard by{' '}
          <TextLink href="https://hoangvvo.com/" color="link">
            Hoang Vo
          </TextLink>
          .
        </Text>
        <Spacer size={1} axis="vertical" />
        <ThemeSwitcher />
      </Wrapper>
    </footer>
  );
};

export default Footer;
