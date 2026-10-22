/**
 * The wordmark. The ampersand is set in the italic of the display face, per
 * the brand guidelines — the roman ampersand does not carry the brand.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`.trim()}>
      ZIYA <span className="amp">&amp;</span> CO.
    </span>
  );
}
