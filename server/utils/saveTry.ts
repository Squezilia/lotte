import type { H3Event, EventHandlerRequest } from 'h3';

export const saveTry = async (event: H3Event<EventHandlerRequest>) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  await prisma.tries.upsert({
    where: {
      ip,
    },
    update: {
      count: {
        increment: 1,
      },
      lastTry: new Date(),
    },
    create: {
      count: 0,
      ip,
    },
  });
};
