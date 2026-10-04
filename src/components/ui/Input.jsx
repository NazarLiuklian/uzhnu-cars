export function Input({ label, id, ...props }) {
  return (
    <label className="field" htmlFor={id}>
      {label && <span className="field__label">{label}</span>}
      <input className="input" id={id} {...props} />
    </label>
  )
}
