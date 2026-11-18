import { products } from '@/lib/catalog';

import { SpecSheet } from './spec-sheet';
import styles from './spec-sheets-document.module.css';

/** Print styles the design's doc-page component adds to the document head (A4, no margins, colours kept). */
const PRINT_CSS =
  '@page{size:210mm 297mm;margin:0}' +
  '@media print{html,body{margin:0!important;padding:0!important;background:none!important;height:auto!important;overflow:visible!important}' +
  '*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';

/** All nine product specification sheets as one printable A4 document. */
export function SpecSheetsDocument() {
  return (
    <div className={styles.desk}>
      <style>{PRINT_CSS}</style>
      <h1 className="sr-only">Todara product specification sheets</h1>
      <div className={styles.sheet}>
        {products.map((p, i) => (
          <SpecSheet key={p.id} product={p} preload={i === 0} />
        ))}
      </div>
    </div>
  );
}
