import styles from './ActingCredit.module.css';

const ActingCredit = ({ name, role }) => {
  return (
    <p className={styles.root}>
      {name}
      <span className={styles.tooltip}>{role}</span>
    </p>
  );
};

export default ActingCredit;
