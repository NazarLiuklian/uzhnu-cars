import { useState } from 'react'
import { SubmissionItem } from '../components/SubmissionItem/SubmissionItem'
import { initialSubmissions } from '../services/mockData'
import styles from './AddCarPage.module.css'

export function AddCarPage({ user }) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [submittedMessage, setSubmittedMessage] = useState(false)

  // Form states
  const [ownerName, setOwnerName] = useState('')
  const [faculty, setFaculty] = useState('')
  const [carModel, setCarModel] = useState('')
  const [year, setYear] = useState('2018')
  const [fuelType, setFuelType] = useState('diesel')
  const [engineVolume, setEngineVolume] = useState('2.0 л або 64 кВт')
  const [transmission, setTransmission] = useState('auto')
  const [bodyColor, setBodyColor] = useState('Чорний, Сірий...')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newSubmission = {
      id: Date.now(),
      title: `${carModel || 'Нове авто'} (${year || 2020})`,
      subtitle: `Викладач: ${ownerName || 'Викладач УжНУ'} • ${faculty || 'Підрозділ УжНУ'} • Надіслано щойно`,
      status: 'pending',
      statusLabel: 'На модерації ⏳',
    }
    setSubmissions([newSubmission, ...submissions])
    setSubmittedMessage(true)
    setTimeout(() => setSubmittedMessage(false), 4000)
  }

  const userEmail = user?.email || 'student@uzhnu.edu.ua'

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Запропонувати авто викладача</h1>
            <p className={styles.subtitle}>
              Заповніть детальну інформацію про автомобіль для перевірки модератором
            </p>
          </div>
          <span className={styles.authorBadge}>
            <span className={styles.authorDot}></span>
            Автор: {userEmail}
          </span>
        </div>

        {submittedMessage && (
          <div className={styles.successMessage}>
            🎉 Дякуємо! Анкету успішно надіслано на модерацію.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Section 1 */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>
              <span>👤 1. Інформація про власника</span>
            </h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  1. Прізвище, ім&apos;я та по батькові викладача
                  <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Наприклад: Бучук Роман Юрійович"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  2. Кафедра / Підрозділ викладача
                  <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Оберіть кафедру зі списку...</option>
                  <option value="Кафедра ІПЗ">
                    Кафедра ІПЗ (Інженерії програмного забезпечення)
                  </option>
                  <option value="Кафедра ІСТ">
                    Кафедра ІСТ (Інформаційних систем та технологій)
                  </option>
                  <option value="Інший підрозділ">Інший підрозділ УжНУ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className={`${styles.section} ${styles.sectionBordered}`}>
            <h3 className={styles.sectionHeading}>
              <span>🚘 2. Ідентифікація автомобіля</span>
            </h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  3. Марка та модель <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Наприклад: Volkswagen Passat B8"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  4. Рік випуску <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  type="number"
                  placeholder="2018"
                  min="1990"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className={`${styles.section} ${styles.sectionBordered}`}>
            <h3 className={styles.sectionHeading}>
              <span>⚙️ 3. Технічні характеристики та параметри</span>
            </h3>
            <div className={styles.grid4}>
              <div className={styles.field}>
                <label className={styles.label}>
                  5. Тип двигуна / палива <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="diesel">Дизель</option>
                  <option value="petrol">Бензин</option>
                  <option value="electro">Електромобіль (EV)</option>
                  <option value="hybrid">Гібрид (PHEV/HEV)</option>
                  <option value="lpg">Газ / Бензин</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>6. Об&apos;єм / батарея</label>
                <input
                  type="text"
                  placeholder="2.0 л або 64 кВт"
                  value={engineVolume}
                  onChange={(e) => setEngineVolume(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>7. Коробка передач</label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className={styles.select}
                >
                  <option value="auto">Автоматична (АКПП)</option>
                  <option value="manual">Механічна (МКПП)</option>
                  <option value="robot">Роботизована</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>8. Колір кузова</label>
                <input
                  type="text"
                  placeholder="Чорний, Сірий..."
                  value={bodyColor}
                  onChange={(e) => setBodyColor(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className={`${styles.section} ${styles.sectionBordered}`}>
            <h3 className={styles.sectionHeading}>
              <span>📸 4. Медіаматеріали та додаткові нотатки</span>
            </h3>

            <div className={styles.field}>
              <label className={styles.label}>
                9. Фотографія автомобіля (бажано на території УжНУ)
              </label>
              <div className={styles.uploadZone}>
                <div className={styles.uploadIcon}>+</div>
                <p className={styles.uploadText}>
                  Перетягніть фото авто сюди або оберіть файл на пристрої
                </p>
                <p className={styles.uploadHint}>Підтримуються формати JPG, PNG до 10 МБ</p>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Додаткові особливості / Комплектація / Де помічено
              </label>
              <textarea
                rows={3}
                placeholder="Наприклад: авто часто паркується біля головного корпусу на БАМі, має панорамний дах..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.textarea}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <span>Відправити анкету на модерацію</span>
            <span>🚀</span>
          </button>
        </form>
      </div>

      {/* History */}
      <section className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <div>
            <h2 className={styles.historyTitle}>Історія ваших пропозицій</h2>
            <p className={styles.subtitle}>
              Статус перевірки надісланих вами автомобілів адміністрацією
            </p>
          </div>
          <span className={styles.historyBadge}>Всього: {submissions.length} авто</span>
        </div>

        <div className={styles.historyList}>
          {submissions.map((sub) => (
            <SubmissionItem key={sub.id} submission={sub} />
          ))}
        </div>
      </section>
    </main>
  )
}
