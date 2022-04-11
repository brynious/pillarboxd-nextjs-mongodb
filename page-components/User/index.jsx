import styles from './User.module.css';
import UserHeader from './UserHeader';
import UserPosts from './UserPosts';
import DefaultLists from './DefaultLists';

export const User = ({ user }) => {
  return (
    <div className={styles.root}>
      <UserHeader user={user} />
      <DefaultLists user={user} />
      <UserPosts user={user} />
    </div>
  );
};
