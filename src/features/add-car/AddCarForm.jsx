import { UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const initialForm = {
  teacher: '',
  department: '',
  brand: '',
  model: '',
  year: '',
  fuel: 'Бензин',
  transmission: 'Автоматична',
}

export function AddCarForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm)

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
    setForm(initialForm)
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <Input
        id="teacher"
        label="ПІБ викладача"
        placeholder="Наприклад, Бучук Р. Ю."
        value={form.teacher}
        onChange={updateField('teacher')}
        required
      />
      <label className="field">
        <span className="field__label">Кафедра</span>
        <select
          className="input"
          value={form.department}
          onChange={updateField('department')}
          required
        >
          <option value="" disabled>
            Оберіть кафедру
          </option>
          <option>ІПЗ</option>
          <option>ІСТ</option>
        </select>
      </label>
      <Input
        id="brand"
        label="Марка"
        placeholder="BMW"
        value={form.brand}
        onChange={updateField('brand')}
        required
      />
      <Input
        id="model"
        label="Модель"
        placeholder="3 Series"
        value={form.model}
        onChange={updateField('model')}
        required
      />
      <Input
        id="year"
        label="Рік випуску"
        type="number"
        min="2000"
        max="2026"
        placeholder="2019"
        value={form.year}
        onChange={updateField('year')}
        required
      />
      <label className="field">
        <span className="field__label">Тип палива</span>
        <select className="input" value={form.fuel} onChange={updateField('fuel')}>
          <option>Електро</option>
          <option>Бензин</option>
          <option>Дизель</option>
        </select>
      </label>
      <label className="field">
        <span className="field__label">Коробка передач</span>
        <select className="input" value={form.transmission} onChange={updateField('transmission')}>
          <option>Автоматична</option>
          <option>Механічна</option>
        </select>
      </label>
      <label className="upload-zone" htmlFor="photo">
        <UploadCloud size={26} />
        <strong>Завантажте фото авто</strong>
        <span>PNG або JPG до 10 МБ</span>
        <input id="photo" type="file" accept="image/png,image/jpeg" />
      </label>
      <div className="form-actions">
        <Button type="submit">Відправити анкету на модерацію</Button>
      </div>
    </form>
  )
}
