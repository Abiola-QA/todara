import styles from './top-bar.module.css';

/** Thin credentials strip above the header (desktop only). */
export function TopBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>Licensed exporter · AFA–HCD · KEPHIS · HACCP · GlobalG.A.P.</div>
    </div>
  );
}
