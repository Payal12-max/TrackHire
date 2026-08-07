export default function Card({ title, children }) {
  return (
    <section className="card">
      <div className="cardtitle">{title}</div>
      {children}
    </section>
  );
}