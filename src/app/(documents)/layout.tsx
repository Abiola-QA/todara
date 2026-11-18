/** Printable documents (the spec sheets): no site header or footer, as in the design. */
export default function DocumentsLayout({ children }: LayoutProps<'/'>) {
  return <main id="main">{children}</main>;
}
