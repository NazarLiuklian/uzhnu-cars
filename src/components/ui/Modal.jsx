export function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal__close" type="button" aria-label="Закрити" onClick={onClose}>
          ×
        </button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  )
}
