import { ClipboardCheck } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { AddCarForm } from '../features/add-car/AddCarForm'
import { useState } from 'react'

const initialSubmissions = [
  {
    id: 'published-audi',
    title: 'Audi A6 · 2020',
    status: 'Опубліковано',
    tone: 'green',
    date: '28 жовтня 2026',
  },
]

export function AddCarPage() {
  const [submissions, setSubmissions] = useState(initialSubmissions)

  const handleSubmit = (car) => {
    setSubmissions((current) => [
      {
        id: Date.now(),
        title: `${car.brand} ${car.model} · ${car.year}`,
        status: 'На модерації',
        tone: 'blue',
        date: new Intl.DateTimeFormat('uk-UA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date()),
      },
      ...current,
    ])
  }

  return (
    <section className="page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">Краудсорсинг</span>
          <h1>Додати автомобіль</h1>
          <p>Допоможіть нам зробити каталог УжНУ повнішим.</p>
        </div>
      </div>
      <div className="auth-notice">
        <ClipboardCheck size={22} />
        <span>
          Ви авторизовані як студент УжНУ. Заповніть анкету, і ми перевіримо дані перед публікацією.
        </span>
      </div>
      <Card className="form-card">
        <div className="card-heading">
          <div>
            <h2>Анкета автомобіля</h2>
            <p>Поля позначені зірочкою є обов’язковими.</p>
          </div>
        </div>
        <AddCarForm onSubmit={handleSubmit} />
      </Card>
      <div className="history-section">
        <div className="section-heading">
          <span className="eyebrow">Ваші внески</span>
          <h2>Історія пропозицій</h2>
        </div>
        <div className="history-list">
          {submissions.map((submission) => (
            <div key={submission.id} data-testid="submission-item">
              <span>{submission.title}</span>
              <Badge tone={submission.tone}>{submission.status}</Badge>
              <small>{submission.date}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
