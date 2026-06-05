import { z } from 'zod';
import { verifySignature, generateSignature } from '~~/shared/signature';

const zodSchema = z.object({
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

    const firstItem = await prisma.links.findFirst();

    if (!verifySignature(result.data.pin, firstItem))
      throw createError({
        statusCode: 401,
        statusMessage: 'Geçersiz PIN',
      });

    return {
      status: 200,
      statusMessage: 'OK',
      message: 'Geçerli PIN',
    };
  },
});
