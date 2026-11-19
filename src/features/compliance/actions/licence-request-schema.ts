import { z } from 'zod';

import { licenceDocumentIds, MAX_RECIPIENTS } from '../data/licence-documents';
import { EMAIL_PATTERN } from '../utils/validate-licence-request';

const required = (message: string, max: number) => z.string(message).trim().min(1, message).max(max, message);

/** Server-side rules for a licence copy request: the design's checks plus length limits and known documents only. */
export const licenceRequestSchema = z.object({
  name: required('Enter your name', 120),
  company: required('Enter your company name', 160),
  emails: z
    .array(z.string().trim().toLowerCase().max(254, 'Enter a valid email address').regex(EMAIL_PATTERN, 'Enter a valid email address'))
    .min(1, 'Enter a valid email address')
    .max(MAX_RECIPIENTS)
    .transform((list) => [...new Set(list)]),
  documents: z
    .array(z.enum(licenceDocumentIds))
    .min(1, 'Choose at least one document')
    .transform((list) => [...new Set(list)]),
  consent: z.literal(true, 'Please agree so we can send the documents'),
});

export type LicenceRequest = z.infer<typeof licenceRequestSchema>;

/** Name of the form field carrying the request as JSON. */
export const LICENCE_REQUEST_FIELD = 'licence-request';
