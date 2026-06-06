import { z } from 'zod';
import { Prisma } from '~~/generated/prisma/client';
import {
  verifySignature,
  generateSignature,
  LinkPayload,
} from '~~/shared/signature';

const zodSchema = z.object({
  pin: z.string(),
  newPin: z.string(),
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
        message: 'Geçersiz PIN',
      });

    if (!firstItem) {
      const payload: LinkPayload = {
        description: '',
        title: '',
        type: 'URL',
        uri: '',
      };
      await prisma.links.create({
        data: {
          ...payload,
          signature: generateSignature(result.data.newPin, payload).digest(
            'hex'
          ),
          purged: true,
        },
      });

      return {
        status: 200,
        message: 'PIN Değiştirildi',
      };
    }

    // don't worry. it's limited to 255 items. (ref: link.post.ts)
    const allItems = await prisma.links.findMany();

    const reconstructDeleteManyArray: string[] = [];
    const reconstructCreateManyArray: Prisma.LinksCreateManyInput[] = [];

    // reconstructing is the shittiest work of all this project
    for (const item of allItems) {
      reconstructDeleteManyArray.push(item.id);
      reconstructCreateManyArray.push({
        ...item,
        signature: generateSignature(result.data.newPin, item).digest('hex'),
      });
    }

    // we're gonna delete all and recreate bc update works slower. (and i don't wanna implement multiple updating)
    await prisma.$transaction(async (tx) => {
      await tx.links.deleteMany({
        where: {
          id: { in: reconstructDeleteManyArray },
        },
      });
      await tx.links.createMany({
        data: reconstructCreateManyArray,
      });
    });

    return {
      status: 200,
      message: 'PIN Değiştirildi',
    };
  },
});
