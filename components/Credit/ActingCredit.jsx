import styles from './ActingCredit.module.css';

const ActingCredit = ({ name, role }) => {
  return (
    <div className={styles.text}>
      <div>
        {name} as {role}
      </div>
      <div className={styles.tooltip}>
        {name}
        <span className={styles.tooltiptext}>{role}</span>
      </div>
    </div>
  );
};

export default ActingCredit;
