export default defineEventHandler({
  async handler(event) {
    const query = getQuery(event);

    const { id } = query;

    return await prisma.links.findMany({
      where: {
        id: id ? id.toString() : undefined,
        purged: false,
      },
    });
  },
});
