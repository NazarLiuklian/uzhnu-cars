export function Card({ children, className = '', ...props }) {
  return (
    <article className={`card ${className}`} {...props}>
      {children}
    </article>
  )
}
