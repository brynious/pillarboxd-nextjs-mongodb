import { Avatar } from '@/components/Avatar';
import { Button, ButtonLink } from '@/components/Button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Container from './Container';
import styles from './Nav.module.css';
import Spacer from './Spacer';
import Wrapper from './Wrapper';
import Search from './Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Star from '@mui/icons-material/Star';
import { Ribbon, Television, Check } from '../Icons/Icons';

const UserMenu = ({ user, mutate }) => {
  const menuRef = useRef();
  const avatarRef = useRef();

  const [visible, setVisible] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const onRouteChangeComplete = () => setVisible(false);
    router.events.on('routeChangeComplete', onRouteChangeComplete);
    return () =>
      router.events.off('routeChangeComplete', onRouteChangeComplete);
  });

  useEffect(() => {
    // detect outside click to close menu
    const onMouseDown = (event) => {
      if (
        !menuRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  const onSignOut = useCallback(async () => {
    try {
      await fetcher('/api/auth', {
        method: 'DELETE',
      });
      toast.success('You have been signed out');
      mutate({ user: null });
    } catch (e) {
      toast.error(e.message);
    }
  }, [mutate]);

  return (
    <div className={styles.user}>
      <button
        className={styles.trigger}
        ref={avatarRef}
        onClick={() => setVisible(!visible)}
      >
        <Avatar size={32} username={user.username} url={user.profilePicture} />
      </button>
      <div
        ref={menuRef}
        role="menu"
        aria-hidden={visible}
        className={styles.popover}
      >
        {visible && (
          <div className={styles.menu}>
            <Link passHref href={`/${user.username}`}>
              <a className={styles.item}>
                <AccountCircleIcon />
                <span>Profile</span>
              </a>
            </Link>
            <Link passHref href={`/${user.username}/watchlist`}>
              <a className={styles.item}>
                <Ribbon />
                <span>Watchlist</span>
              </a>
            </Link>
            <Link passHref href={`/${user.username}/watching`}>
              <a className={styles.item}>
                <Television />
                <span>Watching</span>
              </a>
            </Link>
            <Link passHref href={`/${user.username}/watched`}>
              <a className={styles.item}>
                <Check />
                <span>Watched</span>
              </a>
            </Link>
            <Link passHref href={`/${user.username}/series/ratings`}>
              <a className={styles.item}>
                <Star />
                <span>Series Ratings</span>
              </a>
            </Link>
            <Link passHref href={`/${user.username}/seasons/ratings`}>
              <a className={styles.item}>
                <Star />
                <span>Season Ratings</span>
              </a>
            </Link>
            <Link passHref href={`/${user.username}/seasons?year=2022`}>
              <a className={styles.item}>
                <span>Seasons</span>
              </a>
            </Link>
            <Link passHref href="/settings">
              <a className={styles.item}>Settings</a>
            </Link>
            <div className={styles.item} style={{ cursor: 'auto' }}>
              <Container alignItems="center">
                <span>Theme</span>
                <Spacer size={0.5} axis="horizontal" />
                <ThemeSwitcher />
              </Container>
            </div>
            <button onClick={onSignOut} className={styles.item}>
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Nav = () => {
  const { data: { user } = {}, mutate } = useCurrentUser();

  return (
    <nav className={styles.nav}>
      <Wrapper className={styles.wrapper}>
        <Container
          className={styles.content}
          alignItems="center"
          justifyContent="space-between"
        >
          <Link href="/">
            <a className={styles.logo}>Pillarboxd</a>
          </Link>

          <Link passHref href="/series">
            <ButtonLink
              size="small"
              type="success"
              variant="ghost"
              color="link"
            >
              Series
            </ButtonLink>
          </Link>

          <Search />

          <Container>
            {user ? (
              <>
                <UserMenu user={user} mutate={mutate} />
              </>
            ) : (
              <>
                <Link passHref href="/login">
                  <ButtonLink
                    size="small"
                    type="success"
                    variant="ghost"
                    color="link"
                  >
                    Log in
                  </ButtonLink>
                </Link>
                <Spacer axis="horizontal" size={0.25} />
                <Link passHref href="/sign-up">
                  <Button size="small" type="success">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Container>
        </Container>
      </Wrapper>
    </nav>
  );
};

export default Nav;
