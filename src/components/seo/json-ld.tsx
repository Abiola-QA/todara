type JsonLdProps = {
  /** A schema.org object or @graph. */
  data: Record<string, unknown>;
};

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

/** Serialises structured data so it can never close the <script> tag early. */
export function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replaceAll('<', '\\u003c').replaceAll(LINE_SEPARATOR, '\\u2028').replaceAll(PARAGRAPH_SEPARATOR, '\\u2029');
}

/** Structured data for search engines (schema.org JSON-LD). */
export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
