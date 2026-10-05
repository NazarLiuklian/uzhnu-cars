export function Button({ children = 'Button', ...props }) {
  return <button {...props}>{children}</button>
}
