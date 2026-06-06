import { z } from 'zod';
import { verifySignature } from '../utils/signature';
import { saveTry } from '../utils/saveTry';

const zodSchema = z.object({
  id: z.string(),
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

    if (!verifySignature(result.data.pin, targetLink)) {
      await saveTry(event);
      throw createError({
        statusCode: 401,
        message: 'Geçersiz PIN',
      });
    }

    const linksCount = await prisma.links.count();
    if (linksCount === 1) {
      return await prisma.links.update({
        where: {
          id: result.data.id,
        },
        data: {
          purged: true,
        },
      });
    }

    return await prisma.links.delete({
      where: {
        id: result.data.id,
      },
    });
  },
});
