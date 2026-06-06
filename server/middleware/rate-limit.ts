import { addMinutes, formatDuration, intervalToDuration } from 'date-fns';
import { tr } from 'date-fns/locale';

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (url.pathname.startsWith('/api/link') && event.method === 'GET') return;

  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown';

  const clientTry = await prisma.tries.findFirst({
    where: {
      ip: clientIp,
    },
  });

  if (
    clientTry &&
    clientTry.count % 5 === 0 &&
    addMinutes(clientTry.lastTry, clientTry.count * 3).getTime() > Date.now()
  )
    throw createError({
      statusCode: 429,
      message: `${formatDuration(intervalToDuration({ start: 0, end: addMinutes(clientTry.lastTry, clientTry.count * 3).getTime() - Date.now() }), { locale: tr })} kadar tekrar denemeniz yasaklanmıştır.`,
    });
});
