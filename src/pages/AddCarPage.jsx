import { useEffect, useState } from 'react'
import { SubmissionItem } from '../components/SubmissionItem/SubmissionItem'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import styles from './AddCarPage.module.css'

export function AddCarPage({ user: propUser }) {
  const { user: authUser } = useAuth()
  const activeUser = authUser || propUser

  const [submissions, setSubmissions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedMessage, setSubmittedMessage] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastSubmittedTitle, setLastSubmittedTitle] = useState('')

  // Form states
  const [ownerName, setOwnerName] = useState('')
  const [faculty, setFaculty] = useState('')
  const [carModel, setCarModel] = useState('')
  const [year, setYear] = useState('')
  const [fuelType, setFuelType] = useState('diesel')
  const [engineVolume, setEngineVolume] = useState('2.0 л або 64 кВт')
  const [transmission, setTransmission] = useState('auto')
  const [bodyColor, setBodyColor] = useState('Чорний, Сірий...')
  const [notes, setNotes] = useState('')

  // Form errors
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    let isMounted = true
    api.getSubmissions().then((data) => {
      if (isMounted) setSubmissions(data)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const validate = () => {
    const errors = {}

    if (!ownerName.trim()) {
      errors.ownerName = 'Будь ласка, введіть ПІБ викладача'
    } else if (ownerName.trim().length < 3) {
      errors.ownerName = 'ПІБ має містити щонайменше 3 символи'
    }

    if (!faculty) {
      errors.faculty = 'Оберіть кафедру або підрозділ зі списку'
    }

    if (!carModel.trim()) {
      errors.carModel = 'Вкажіть марку та модель автомобіля'
    }

    const yearNum = Number(year)
    if (!year || isNaN(yearNum) || yearNum < 1990 || yearNum > 2026) {
      errors.year = 'Рік випуску повинен бути в діапазоні 1990–2026'
    }

    if (!fuelType) {
      errors.fuelType = 'Оберіть тип двигуна'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    const title = `${carModel.trim()} (${year})`
    const subtitle = `Викладач: ${ownerName.trim()} • ${faculty} • Надіслано щойно`

    try {
      const newSubmission = await api.addSubmission({ title, subtitle })
      setSubmissions((prev) => [newSubmission, ...prev])

      // Also create car in the local catalog
      const fuelLabels = {
        diesel: 'Дизель',
        petrol: 'Бензин',
        electro: 'Електро',
        hybrid: 'Гібрид',
        lpg: 'Газ / Бензин',
      }
      const transmissionLabels = {
        auto: 'Автоматична (АКПП)',
        manual: 'Механічна (МКПП)',
        robot: 'Роботизована',
      }

      await api.addCar({
        brand: carModel.split(' ')[0] || carModel,
        model: carModel.split(' ').slice(1).join(' ') || '',
        year,
        faculty,
        owner: ownerName,
        fuel: fuelLabels[fuelType] || fuelType,
        transmission: transmissionLabels[transmission] || transmission,
        engineVolume,
        notes,
      })

      setLastSubmittedTitle(title)
      setSubmittedMessage(true)
      setShowSuccessModal(true)

      // Reset form fields
      setOwnerName('')
      setFaculty('')
      setCarModel('')
      setYear('')
      setNotes('')
      setFormErrors({})

      setTimeout(() => setSubmittedMessage(false), 5000)
    } catch (err) {
      alert(err.message || 'Помилка при додаванні авто')
    } finally {
      setIsSubmitting(false)
    }
  }

  const userEmail = activeUser?.email || 'student@uzhnu.edu.ua'

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
          <div className={styles.successMessage} role="status">
            🎉 Дякуємо! Анкету &quot;{lastSubmittedTitle}&quot; успішно надіслано на модерацію.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Section 1 */}
          <div className={styles.section}>
            <h3 className={styles.sectionHeading}>
              <span>👤 1. Інформація про власника</span>
            </h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="ownerName">
                  1. Прізвище, ім&apos;я та по батькові викладача
                  <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  id="ownerName"
                  type="text"
                  placeholder="Наприклад: Бучук Роман Юрійович"
                  value={ownerName}
                  onChange={(e) => {
                    setOwnerName(e.target.value)
                    if (formErrors.ownerName) setFormErrors((p) => ({ ...p, ownerName: null }))
                  }}
                  className={`${styles.input} ${formErrors.ownerName ? styles.inputError : ''}`}
                  required
                />
                {formErrors.ownerName && (
                  <span className={styles.fieldError}>{formErrors.ownerName}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="faculty">
                  2. Кафедра / Підрозділ викладача
                  <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  id="faculty"
                  value={faculty}
                  onChange={(e) => {
                    setFaculty(e.target.value)
                    if (formErrors.faculty) setFormErrors((p) => ({ ...p, faculty: null }))
                  }}
                  className={`${styles.select} ${formErrors.faculty ? styles.inputError : ''}`}
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
                {formErrors.faculty && (
                  <span className={styles.fieldError}>{formErrors.faculty}</span>
                )}
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
                <label className={styles.label} htmlFor="carModel">
                  3. Марка та модель <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  id="carModel"
                  type="text"
                  placeholder="Наприклад: Volkswagen Passat B8"
                  value={carModel}
                  onChange={(e) => {
                    setCarModel(e.target.value)
                    if (formErrors.carModel) setFormErrors((p) => ({ ...p, carModel: null }))
                  }}
                  className={`${styles.input} ${formErrors.carModel ? styles.inputError : ''}`}
                  required
                />
                {formErrors.carModel && (
                  <span className={styles.fieldError}>{formErrors.carModel}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="year">
                  4. Рік випуску <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  placeholder="Наприклад: 2019"
                  min="1990"
                  max="2026"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value)
                    if (formErrors.year) setFormErrors((p) => ({ ...p, year: null }))
                  }}
                  className={`${styles.input} ${formErrors.year ? styles.inputError : ''}`}
                  required
                />
                {formErrors.year && <span className={styles.fieldError}>{formErrors.year}</span>}
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
                <label className={styles.label} htmlFor="fuelType">
                  5. Тип двигуна / палива <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  id="fuelType"
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
                <label className={styles.label} htmlFor="engineVolume">
                  6. Об&apos;єм / батарея
                </label>
                <input
                  id="engineVolume"
                  type="text"
                  placeholder="2.0 л або 64 кВт"
                  value={engineVolume}
                  onChange={(e) => setEngineVolume(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="transmission">
                  7. Коробка передач
                </label>
                <select
                  id="transmission"
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
                <label className={styles.label} htmlFor="bodyColor">
                  8. Колір кузова
                </label>
                <input
                  id="bodyColor"
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
              <label className={styles.label} htmlFor="notes">
                Додаткові особливості / Комплектація / Де помічено
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Наприклад: авто часто паркується біля головного корпусу на БАМі, має панорамний дах..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.textarea}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <span>
              {isSubmitting ? 'Відправка на модерацію... ⏳' : 'Відправити анкету на модерацію'}
            </span>
            {!isSubmitting && <span>🚀</span>}
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

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Заявку успішно прийнято"
      >
        <div className={styles.modalSuccessContent}>
          <div className={styles.successIconBadge}>✓</div>
          <h4 className={styles.modalSuccessTitle}>Автомобіль надіслано на розгляд!</h4>
          <p className={styles.modalSuccessText}>
            Вашу пропозицію <strong>&quot;{lastSubmittedTitle}&quot;</strong> додано до списку
            модерації. Після перевірки викладачем або адміністратором статус автоматично оновиться в
            історії пропозицій.
          </p>
          <button
            type="button"
            className={styles.modalOkBtn}
            onClick={() => setShowSuccessModal(false)}
          >
            Зрозуміло
          </button>
        </div>
      </Modal>
    </main>
  )
}
