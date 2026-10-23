/**
 * The wordmark. The ampersand is the italic of the display face.
 * Set as "ZIYA & CO", with no full stop, per the brand document.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      ZIYA <span className="amp">&amp;</span> CO
    </span>
  );
}
