import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useNavigate } from 'react-router-dom'

export function AuthForm({ onLogin }) {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin()
    navigate('/add-car')
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <Input
        id="email"
        type="email"
        label="Корпоративна пошта"
        placeholder="name@uzhnu.edu.ua"
        pattern={'.+@uzhnu\\.edu\\.ua'}
        required
      />
      <Input id="password" type="password" label="Пароль" placeholder="Введіть пароль" required />
      <Button type="submit">Увійти до кабінету</Button>
    </form>
  )
}
