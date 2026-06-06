import { z } from 'zod';
import { generateSignature, verifySignature } from '../utils/signature';
import { saveTry } from '../utils/saveTry';

const zodSchema = z.object({
  type: z.enum(['URL', 'PHONE']),
  uri: z.string(),
  title: z.string(),
  description: z.string(),
  pin: z.string(),
});

export default defineEventHandler({
  async handler(event) {
    const result = await readValidatedBody(event, (body) =>
      zodSchema.safeParse(body)
    );

    if (!result.success)
      throw createError({
        statusCode: 400,
        data: result.error.issues,
      });

    // it's neccessary because my shitty code works by allocating all items once when reconstructing links.
    // also what in the world who needs links more than 255 ???? it's not an url shortener. (or is it?)
    if ((await prisma.links.count()) + 1 > 255)
      throw createError({
        statusCode: 400,
        message: 'Maksimum 255 Adet Bağlantı Kullanılabilir.',
      });

    const firstItem = await prisma.links.findFirst();

    if (!verifySignature(result.data.pin, firstItem)) {
      await saveTry(event);
      throw createError({
        statusCode: 401,
        message: 'Geçersiz PIN',
      });
    }

    return await prisma.$transaction(async (tx) => {
      if (firstItem?.purged) {
        await tx.links.delete({
          where: {
            id: firstItem.id,
          },
        });
      }

      return await tx.links.create({
        data: {
          type: result.data.type,
          uri: result.data.uri,

          title: result.data.title,
          description: result.data.description,
          signature: generateSignature(result.data.pin, result.data).digest(
            'hex'
          ),
        },
      });
    });
  },
});
