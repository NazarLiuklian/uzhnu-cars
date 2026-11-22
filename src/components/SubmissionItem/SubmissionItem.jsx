import styles from './SubmissionItem.module.css'

export function SubmissionItem({ submission }) {
  const isPublished = submission.status === 'published'
  const statusLabel = isPublished ? '✅ Опубліковано' : '⏳ На перевірці'
  const title =
    submission.title ||
    `${submission.brand || ''} ${submission.model || ''}${submission.year ? ` (${submission.year})` : ''}`.trim()
  const subtitle =
    submission.subtitle ||
    `Викладач: ${submission.owner || submission.teacher_name || 'Не вказано'} • ${submission.faculty || submission.department || 'Не вказано'}`

  return (
    <div className={`${styles.item} ${isPublished ? styles.itemApproved : styles.itemPending}`}>
      <div className={styles.left}>
        {submission.image || submission.imageUrl ? (
          <img src={submission.image || submission.imageUrl} alt={title} className={styles.photo} />
        ) : (
          <div
            className={`${styles.iconBox} ${
              isPublished ? styles.iconBoxApproved : styles.iconBoxPending
            }`}
          >
            {isPublished ? '✅' : '⏳'}
          </div>
        )}
        <div>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
      <span
        className={`${styles.badge} ${isPublished ? styles.badgeApproved : styles.badgePending}`}
      >
        {submission.statusLabel || statusLabel}
      </span>
    </div>
  )
}
