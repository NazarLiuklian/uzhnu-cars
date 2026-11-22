import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SubmissionItem } from '../components/SubmissionItem/SubmissionItem'
import { Modal } from '../components/ui/Modal'
import { useAuth } from '../hooks/useAuth'
import { useCars } from '../hooks/useCars'
import { api } from '../services/api'
import { compressImage } from '../utils/compressImage'
import styles from './AddCarPage.module.css'

export function AddCarPage({ user: propUser }) {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const { addCar } = useCars()
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
  const [fuelType, setFuelType] = useState('Бензин')
  const [engineVolume, setEngineVolume] = useState('')
  const [transmission, setTransmission] = useState('Автомат')
  const [bodyColor, setBodyColor] = useState('')
  const [notes, setNotes] = useState('')

  // Стан фото автомобіля (обов'язкове)
  const [carImage, setCarImage] = useState('')
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [imageError, setImageError] = useState('')

  // Form errors
  const [formErrors, setFormErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    let isMounted = true
    api.getSubmissions(activeUser?.email).then((data) => {
      if (isMounted) setSubmissions(data)
    })
    return () => {
      isMounted = false
    }
  }, [activeUser?.email])

  const processImageFile = async (file) => {
    if (!file) {
      setCarImage('')
      setImageError('Будь ласка, завантажте фотографію автомобіля')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setCarImage('')
      setImageError('Розмір файлу не повинен перевищувати 10 МБ')
      return
    }

    try {
      const compressedImage = await compressImage(file)
      setCarImage(compressedImage)
      setImageError('')
      setFormErrors((prev) => ({ ...prev, carImage: null }))
      setGeneralError('')
    } catch (error) {
      setCarImage('')
      setImageError(error.message || 'Не вдалося обробити файл')
    }
  }

  const handleImageChange = async (e) => {
    await processImageFile(e.target.files?.[0])
  }

  const handleImageDrop = async (e) => {
    e.preventDefault()
    setIsDraggingImage(false)
    await processImageFile(e.dataTransfer.files?.[0])
  }

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
      errors.fuelType = 'Оберіть тип палива'
    }

    if (!engineVolume.trim()) {
      errors.engineVolume = 'Вкажіть обʼєм двигуна або ємність батареї'
    }

    if (!transmission) {
      errors.transmission = 'Оберіть коробку передач'
    }

    if (!bodyColor.trim()) {
      errors.bodyColor = 'Вкажіть колір кузова'
    }

    if (!carImage) {
      errors.carImage = 'Фотографія автомобіля є обовʼязковою'
      setImageError('Будь ласка, завантажте фотографію автомобіля')
    }

    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      setGeneralError('Будь ласка, заповніть усі обовʼязкові поля форми (позначені зірочкою *)')
      return false
    }

    setGeneralError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    const title = `${carModel.trim()} (${year})`
    const subtitle = `Викладач: ${ownerName.trim()} • ${faculty} • Очікує модерації`

    try {
      const carData = {
        brand: carModel.split(' ')[0] || carModel,
        model: carModel.split(' ').slice(1).join(' ') || '',
        year: Number(year),
        faculty,
        department: faculty,
        owner: ownerName.trim(),
        teacher_name: ownerName.trim(),
        fuel: fuelType,
        fuel_type: fuelType,
        engine: fuelType,
        engineVolume: engineVolume.trim(),
        engine_volume: engineVolume.trim(),
        transmission,
        color: bodyColor.trim(),
        bodyColor: bodyColor.trim(),
        imageUrl: carImage,
        image: carImage,
        notes: notes.trim(),
      }

      await addCar(carData)

      const newSubmission = await api.addSubmission({
        title,
        subtitle,
        userEmail: activeUser?.email,
      })
      setSubmissions((prev) => [newSubmission, ...prev])

      setLastSubmittedTitle(title)
      setSubmittedMessage(true)
      setShowSuccessModal(true)

      // Очищення форми
      setOwnerName('')
      setFaculty('')
      setCarModel('')
      setYear('')
      setFuelType('Бензин')
      setEngineVolume('')
      setTransmission('Автомат')
      setBodyColor('')
      setNotes('')
      setCarImage('')
      setImageError('')
      setFormErrors({})
      setGeneralError('')

      setTimeout(() => setSubmittedMessage(false), 5000)
    } catch (err) {
      alert(err.message || 'Помилка при додаванні авто')
    } finally {
      setIsSubmitting(false)
    }
  }

  const userEmail = activeUser?.email || 'student@student.uzhnu.edu.ua'

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Запропонувати авто викладача</h1>
            <p className={styles.subtitle}>
              Заповніть детальну інформацію про автомобіль для подання на модерацію
            </p>
          </div>
          <span className={styles.authorBadge}>
            <span className={styles.authorDot}></span>
            Автор: {userEmail}
          </span>
        </div>

        {submittedMessage && (
          <div className={styles.successMessage} role="status">
            🎉 Дякуємо! Заявку відправлено на модерацію адміністратору.
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate autoComplete="off">
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
                  autoComplete="off"
                  placeholder="Наприклад: Бучук Роман Юрійович"
                  value={ownerName}
                  onChange={(e) => {
                    setOwnerName(e.target.value)
                    if (formErrors.ownerName) setFormErrors((p) => ({ ...p, ownerName: null }))
                    setGeneralError('')
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
                    setGeneralError('')
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
                  autoComplete="off"
                  placeholder="Наприклад: Volkswagen Passat B8"
                  value={carModel}
                  onChange={(e) => {
                    setCarModel(e.target.value)
                    if (formErrors.carModel) setFormErrors((p) => ({ ...p, carModel: null }))
                    setGeneralError('')
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
                  autoComplete="off"
                  placeholder="Наприклад: 2019"
                  min="1990"
                  max="2026"
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value)
                    if (formErrors.year) setFormErrors((p) => ({ ...p, year: null }))
                    setGeneralError('')
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
                  5. Тип палива <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  id="fuelType"
                  value={fuelType}
                  onChange={(e) => {
                    setFuelType(e.target.value)
                    if (formErrors.fuelType) setFormErrors((p) => ({ ...p, fuelType: null }))
                    setGeneralError('')
                  }}
                  className={styles.select}
                  required
                >
                  <option value="Бензин">Бензин</option>
                  <option value="Дизель">Дизель</option>
                  <option value="Електро">Електро</option>
                  <option value="Гібрид">Гібрид</option>
                </select>
                {formErrors.fuelType && (
                  <span className={styles.fieldError}>{formErrors.fuelType}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="engineVolume">
                  6. Об&apos;єм / батарея <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  id="engineVolume"
                  type="text"
                  autoComplete="off"
                  placeholder=""
                  value={engineVolume}
                  onChange={(e) => {
                    setEngineVolume(e.target.value)
                    if (formErrors.engineVolume) {
                      setFormErrors((p) => ({ ...p, engineVolume: null }))
                    }
                    setGeneralError('')
                  }}
                  className={`${styles.input} ${formErrors.engineVolume ? styles.inputError : ''}`}
                  required
                />
                {formErrors.engineVolume && (
                  <span className={styles.fieldError}>{formErrors.engineVolume}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="transmission">
                  7. Коробка передач <span className={styles.requiredStar}>*</span>
                </label>
                <select
                  id="transmission"
                  value={transmission}
                  onChange={(e) => {
                    setTransmission(e.target.value)
                    if (formErrors.transmission) {
                      setFormErrors((p) => ({ ...p, transmission: null }))
                    }
                    setGeneralError('')
                  }}
                  className={styles.select}
                  required
                >
                  <option value="Автомат">Автомат</option>
                  <option value="Механіка">Механіка</option>
                </select>
                {formErrors.transmission && (
                  <span className={styles.fieldError}>{formErrors.transmission}</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="bodyColor">
                  8. Колір кузова <span className={styles.requiredStar}>*</span>
                </label>
                <input
                  id="bodyColor"
                  type="text"
                  autoComplete="off"
                  placeholder=""
                  value={bodyColor}
                  onChange={(e) => {
                    setBodyColor(e.target.value)
                    if (formErrors.bodyColor) setFormErrors((p) => ({ ...p, bodyColor: null }))
                    setGeneralError('')
                  }}
                  className={`${styles.input} ${formErrors.bodyColor ? styles.inputError : ''}`}
                  required
                />
                {formErrors.bodyColor && (
                  <span className={styles.fieldError}>{formErrors.bodyColor}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className={`${styles.section} ${styles.sectionBordered}`}>
            <h3 className={styles.sectionHeading}>
              <span>📸 4. Медіаматеріали та додаткові нотатки</span>
            </h3>

            {/* Блок завантаження фото (обов'язкове) */}
            <div className={styles.field}>
              <label className={styles.label}>
                9. Фотографія автомобіля <span className={styles.requiredStar}>*</span>
              </label>
              <div
                className={`${styles.uploadZone} ${isDraggingImage ? styles.uploadZoneActive : ''} ${
                  formErrors.carImage || imageError ? styles.inputError : ''
                }`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingImage(true)
                }}
                onDragLeave={() => setIsDraggingImage(false)}
                onDrop={handleImageDrop}
                onClick={() => document.getElementById('carImageInput')?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    document.getElementById('carImageInput')?.click()
                  }
                }}
              >
                <input
                  id="carImageInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  hidden
                />

                {carImage ? (
                  <img
                    src={carImage}
                    alt="Попередній перегляд автомобіля"
                    className={styles.imagePreview}
                  />
                ) : (
                  <>
                    <div className={styles.uploadIcon}>+</div>
                    <p className={styles.uploadText}>Натисніть або перетягніть фото авто сюди</p>
                    <p className={styles.uploadHint}>
                      Підтримуються формати JPG, PNG, WEBP до 10 МБ (обовʼязково)
                    </p>
                  </>
                )}

                {carImage && (
                  <p className={styles.uploadHint}>
                    Натисніть або перетягніть інше фото для заміни
                  </p>
                )}
              </div>

              {(imageError || formErrors.carImage) && (
                <span className={styles.fieldError}>{imageError || formErrors.carImage}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="notes">
                Додаткові особливості / Комплектація / Де помічено (необовʼязково)
              </label>
              <textarea
                id="notes"
                rows={3}
                autoComplete="off"
                placeholder="Залиште додаткові нотатки за бажанням..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.textarea}
              />
            </div>
          </div>

          {generalError && (
            <div
              style={{
                color: '#e11d48',
                backgroundColor: '#fff1f2',
                border: '1px solid #fecdd3',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              ⚠️ {generalError}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            <span>{isSubmitting ? 'Надсилання заявки... ⏳' : 'Надіслати на модерацію'}</span>
            {!isSubmitting && <span>🚀</span>}
          </button>
        </form>
      </div>

      {/* History */}
      <section className={styles.historyCard}>
        <div className={styles.historyHeader}>
          <div>
            <h2 className={styles.historyTitle}>Історія ваших пропозицій</h2>
            <p className={styles.subtitle}>Автомобілі, які ви додали до каталогу</p>
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
        onClose={() => {
          setShowSuccessModal(false)
          navigate('/')
        }}
        title="Заявку відправлено на модерацію"
      >
        <div className={styles.modalSuccessContent}>
          <div className={styles.successIconBadge}>✓</div>
          <h4 className={styles.modalSuccessTitle}>Заявку успішно надіслано!</h4>
          <p className={styles.modalSuccessText}>
            Заявку щодо автомобіля <strong>&quot;{lastSubmittedTitle}&quot;</strong> відправлено на
            модерацію адміністратору. Після перевірки автомобіль зʼявиться в каталозі.
          </p>
          <button
            type="button"
            className={styles.modalOkBtn}
            onClick={() => {
              setShowSuccessModal(false)
              navigate('/')
            }}
          >
            Зрозуміло
          </button>
        </div>
      </Modal>
    </main>
  )
}
