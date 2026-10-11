import styles from './SubmissionItem.module.css'

export function SubmissionItem({ submission }) {
  const isApproved = submission.status === 'approved'

  return (
    <div className={`${styles.item} ${isApproved ? styles.itemApproved : styles.itemPending}`}>
      <div className={styles.left}>
        <div
          className={`${styles.iconBox} ${
            isApproved ? styles.iconBoxApproved : styles.iconBoxPending
          }`}
        >
          {isApproved ? '✅' : '⏳'}
        </div>
        <div>
          <h4 className={styles.title}>{submission.title}</h4>
          <p className={styles.subtitle}>{submission.subtitle}</p>
        </div>
      </div>
      <span
        className={`${styles.badge} ${isApproved ? styles.badgeApproved : styles.badgePending}`}
      >
        {submission.statusLabel}
      </span>
    </div>
  )
}
