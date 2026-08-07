export default function Modal({
  title,
  close,
  children,
}) {
  return (
    <div className="modalback" onClick={close}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="x" onClick={close}>
          ×
        </button>

        <h2>{title}</h2>

        {children}
      </div>
    </div>
  );
}