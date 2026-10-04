import { ClipboardCheck } from 'lucide-react'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { AddCarForm } from '../features/add-car/AddCarForm'
import { useState } from 'react'

export function AddCarPage() {
  const [submissions, setSubmissions] = useState([])

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
      <div className="auth-notice">
        <ClipboardCheck size={22} />
        <span>
          Ви авторизовані як студент УжНУ. Заповніть анкету, і ми перевіримо дані перед публікацією.
        </span>
      </div>
      <Card className="form-card">
        <div className="card-heading">
          <div>
            <h2>Запропонувати авто викладача</h2>
            <p>Заповніть детальну інформацію про автомобіль для перевірки модератором.</p>
          </div>
          <Badge tone="green">Автор: student@uzhnu.edu.ua</Badge>
        </div>
        <AddCarForm onSubmit={handleSubmit} />
      </Card>
      <div className="history-section">
        <div className="section-heading section-heading--history">
          <div>
            <h2>Історія ваших пропозицій</h2>
            <p>Статус перевірки надісланих вами автомобілів адміністрацією</p>
          </div>
          <span className="history-total">Всього: 2 авто</span>
        </div>
        <div className="history-list">
          <div className="history-card history-card--pending"><span className="history-icon">⏳</span><div><strong>Skoda Fabia (2015, 1.4 TDI)</strong><small>Викладач: Семків О. М. • Кафедра ІСТ • Надіслано сьогодні</small></div><Badge tone="amber">На модерації ⏳</Badge></div>
          <div className="history-card history-card--published"><span className="history-icon">✅</span><div><strong>BMW 3 Series (2019, 2.0 Petrol)</strong><small>Викладач: Бучук Р. Ю. • Кафедра ІМЗ • Опубліковано в каталозі</small></div><Badge tone="green">Опубліковано ✅</Badge></div>
          {submissions.map((submission) => <div className="history-card" key={submission.id} data-testid="submission-item"><span className="history-icon">⏳</span><div><strong>{submission.title}</strong><small>{submission.date}</small></div><Badge tone={submission.tone}>{submission.status}</Badge></div>)}
        </div>
      </div>
    </section>
  )
}
