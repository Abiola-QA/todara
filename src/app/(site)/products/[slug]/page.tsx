import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbNode, graph, organizationNode } from '@/components/seo/structured-data';
import { mediaUrl } from '@/config/media';
import { paths } from '@/config/paths';
import { pageMetadata } from '@/config/seo';
import { ProductDetail } from '@/features/products/components/product-detail';
import { photoSize, productSeo } from '@/features/products/utils/product-view';
import { productNode } from '@/features/products/utils/structured-data';
import { productBySlug, products } from '@/lib/catalog';

/*
 * The nine product pages are prerendered from the catalogue slugs.
 *
 * Cache Components is on, so `dynamicParams = false` cannot be exported. An unknown slug calls notFound()
 * instead; `params` is awaited before anything renders and `instant = false` lets the route block, so an
 * unknown slug gets a real 404 rather than a 200 shell.
 */
export const instant = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  const { title, description } = productSeo(product);
  return pageMetadata({
    title,
    description,
    path: paths.product(product.slug),
    image: { url: mediaUrl(product.image), ...photoSize(product.image), alt: product.imageAlt },
  });
}

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const product = productBySlug((await params).slug);
  if (!product) notFound();
  return (
    <>
      <JsonLd
        data={graph(
          organizationNode(),
          productNode(product),
          breadcrumbNode([
            { name: 'Products', path: paths.products },
            { name: product.name, path: paths.product(product.slug) },
          ]),
        )}
      />
      <ProductDetail product={product} />
    </>
  );
}
