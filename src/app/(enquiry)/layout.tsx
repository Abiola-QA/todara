import { SiteShell } from '@/components/layouts/site-shell';

/** The quote page ends with the form itself, so it has no "Talk to our export team" band. */
export default function EnquiryLayout({ children }: LayoutProps<'/'>) {
  return <SiteShell showCta={false}>{children}</SiteShell>;
}
