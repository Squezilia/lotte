import { z } from 'zod';
import { verifySignature, generateSignature } from '~~/shared/signature';

const zodSchema = z.object({
  id: z.string(),
  uri: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
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

    const targetLink = await prisma.links.findFirst({
      where: {
        id: result.data.id,
        purged: false,
      },
    });

    if (!targetLink)
      throw createError({
        statusCode: 400,
        message: 'Bağlantı Bulunamadı.',
      });

    if (!verifySignature(result.data.pin, targetLink))
      throw createError({
        statusCode: 401,
        message: 'Geçersiz PIN',
      });

    return await prisma.links.update({
      where: {
        id: result.data.id,
      },
      data: {
        uri: result.data.uri,

        title: result.data.title,
        description: result.data.description,
        signature: generateSignature(result.data.pin, {
          ...targetLink,
          ...result.data,
        }).digest('hex'),
      },
    });
  },
});
