// Deterministic decorative barcode seeded from the application id, so each
// ticket has a consistent-looking code rather than a random one on every render.
export default function Barcode({ seed, color = '#D6D4C6' }) {
  const bars = [];
  let n = seed * 9301 + 49297;
  for (let i = 0; i < 24; i++) {
    n = (n * 9301 + 49297) % 233280;
    const width = (n % 3) + 1;
    bars.push(width);
  }
  let x = 0;
  return (
    <svg width="96" height="20" viewBox="0 0 96 20" aria-hidden="true">
      {bars.map((w, i) => {
        const rect = <rect key={i} x={x} y={0} width={w} height={20} fill={color} />;
        x += w + 2;
        return rect;
      })}
    </svg>
  );
}
