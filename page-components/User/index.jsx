import styles from './User.module.css';
import UserHeader from './UserHeader';
import DefaultLists from './DefaultLists';

export const User = ({ user }) => {
  return (
    <div className={styles.root}>
      <UserHeader user={user} />
      <DefaultLists />
    </div>
  );
};
