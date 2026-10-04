import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const initialForm = {
  teacher: '',
  department: '',
  brandModel: '',
  year: '',
  fuel: 'Дизель',
  engine: '',
  transmission: 'Автоматична (АКПП)',
  color: '',
  notes: '',
}

export function AddCarForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ ...form, brand: form.brandModel, model: form.brandModel })
    setForm(initialForm)
  }

  return (
    <form className="detailed-car-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>👤 1. Інформація про власника</h3>
        <div className="form-grid">
          <Input id="teacher" label="1. Прізвище, ім'я та по батькові викладача *" placeholder="Наприклад: Бучук Роман Юрійович" value={form.teacher} onChange={updateField('teacher')} required />
          <label className="field"><span className="field__label">2. Кафедра / Підрозділ викладача *</span><select className="input" value={form.department} onChange={updateField('department')} required><option value="">Оберіть кафедру зі списку...</option><option>Кафедра ІМЗ (Інформаційно-моделюючих систем)</option><option>Кафедра ІСТ (Інформаційних систем та технологій)</option><option>Кафедра ПЗ (Програмного забезпечення систем)</option><option>Інший підрозділ УжНУ</option></select></label>
        </div>
      </div>
      <div className="form-section">
        <h3>🚘 2. Ідентифікація автомобіля</h3>
        <div className="form-grid">
          <Input id="brand-model" label="3. Марка та модель *" placeholder="Наприклад: Volkswagen Passat B8" value={form.brandModel} onChange={updateField('brandModel')} required />
          <Input id="year" label="4. Рік випуску *" type="number" min="1990" max="2026" placeholder="2018" value={form.year} onChange={updateField('year')} required />
        </div>
      </div>
      <div className="form-section">
        <h3>⚙️ 3. Технічні характеристики та параметри</h3>
        <div className="form-grid form-grid--four">
          <label className="field"><span className="field__label">5. Тип двигуна / палива *</span><select className="input" value={form.fuel} onChange={updateField('fuel')}><option>Дизель</option><option>Бензин</option><option>Електромобіль (EV)</option><option>Гібрид (PHEV/HEV)</option><option>Газ / Бензин</option></select></label>
          <Input id="engine" label="6. Об'єм / батарея" placeholder="2.0 л або 64 кВт" value={form.engine} onChange={updateField('engine')} />
          <label className="field"><span className="field__label">7. Коробка передач</span><select className="input" value={form.transmission} onChange={updateField('transmission')}><option>Автоматична (АКПП)</option><option>Механічна (МКПП)</option><option>Роботизована</option></select></label>
          <Input id="color" label="8. Колір кузова" placeholder="Чорний, Сірий..." value={form.color} onChange={updateField('color')} />
        </div>
      </div>
      <div className="form-section">
        <h3>📸 4. Медіаматеріали та додаткові нотатки</h3>
        <label className="upload-zone upload-zone--detailed" htmlFor="photo">
          <span className="upload-plus">+</span>
          <strong>Перетягніть фото авто сюди або оберіть файл на пристрої</strong>
          <span>Підтримуються формати JPG, PNG до 10 МБ</span>
          <input id="photo" type="file" accept="image/png,image/jpeg" />
        </label>
        <label className="field"><span className="field__label">Додаткові особливості / Комплектація / Де помічено</span><textarea className="input textarea" rows="3" placeholder="Наприклад: авто часто паркується біля головного корпусу на БАМі, має панорамний дах..." value={form.notes} onChange={updateField('notes')} /></label>
      </div>
      <Button type="submit" className="form-submit">Відправити анкету на модерацію 🚀</Button>
    </form>
  )
}
