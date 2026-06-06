import type { Links } from '~~/generated/prisma/client';
import { createHmac, timingSafeEqual } from 'crypto';

type Link = Omit<Links, 'id' | 'purged'>;
export type LinkPayload = Omit<Link, 'signature'>;

export function asSignatureData(payload: LinkPayload) {
  return `${payload.type}:${payload.uri}:${payload.title}:${payload.description}`;
}

export function generateSignature(pin: string, payload: LinkPayload) {
  return createHmac('sha256', pin).update(asSignatureData(payload));
}

export function verifySignature(pin: string, origin: Link | null) {
  if (!origin) {
    if (pin !== process.env.NUXT_DEFAULT_SIGNATURE_PIN) return false;
    return true;
  }

  const builtSignature = generateSignature(pin, origin).digest();
  const originSignature = Buffer.from(origin.signature, 'hex');

  if (builtSignature.length !== originSignature.length) return false;
  return timingSafeEqual(builtSignature, originSignature);
}
