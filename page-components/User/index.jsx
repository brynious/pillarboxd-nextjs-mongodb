import styles from './User.module.css';
import UserHeader from './UserHeader';
import UserPosts from './UserPosts';
import WatchlistSection from './WatchlistSection';

export const User = ({ user }) => {
  return (
    <div className={styles.root}>
      <UserHeader user={user} />
      <WatchlistSection user={user} />
      <UserPosts user={user} />
    </div>
  );
};
