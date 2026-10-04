import { Fuel, MapPin, CalendarDays } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'

export function CarCard({ car }) {
  const handleImageError = (event) => {
    event.currentTarget.classList.add('is-broken')
  }

  return (
    <Card className="car-card" data-testid="car-card">
      <div className="car-card__image-wrap" data-fallback="Фото авто недоступне">
        <img
          className="car-card__image"
          src={car.image}
          alt={car.model}
          onError={handleImageError}
        />
        <Badge tone={car.fuel === 'Електро' ? 'green' : 'blue'}>{car.fuel}</Badge>
      </div>
      <div className="car-card__body">
        <div className="car-card__heading">
          <div>
            <h3>{car.model}</h3>
            <p>{car.teacher}</p>
          </div>
          <span className="car-card__department">{car.department}</span>
        </div>
        <div className="car-card__meta">
          <span>
            <CalendarDays size={15} /> {car.year}
          </span>
          <span>
            <Fuel size={15} /> {car.fuel}
          </span>
          <span>
            <MapPin size={15} /> УжНУ
          </span>
        </div>
      </div>
    </Card>
  )
}
