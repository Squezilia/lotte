import { z } from 'zod';
import { verifySignature } from '../utils/signature';
import { saveTry } from '../utils/saveTry';

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

    if (!verifySignature(result.data.pin, firstItem)) {
      await saveTry(event);
      throw createError({
        statusCode: 401,
        message: 'Geçersiz PIN',
      });
    }

    return {
      status: 200,
      message: 'Geçerli PIN',
    };
  },
});
