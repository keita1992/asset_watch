import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updateJpyCash = async () => {
  try {
    const profile = await prisma.profiles.findFirst({
      where: { id: 1 },
    });
    if (!profile) {
      throw new Error("Profile not found");
    }
    const amount = await prisma.assets.aggregate({
      where: {
        OR: [
          { currency: { not: "JPY" } },
          { category: { not: "現金" } },
        ],
        deletedAt: null,
      },
      _sum: {
        amount: true,
      },
    });
    const jpyCashAmount = profile.netAssets - profile.liabilities - (amount?._sum.amount ?? 0);
    const jpyCash = await prisma.assets.findFirst({
      where: {
        currency: "JPY",
        category: "現金",
        deletedAt: null,
      },
    });
    if (!jpyCash) {
      throw new Error("JPY Cash not found");
    }
    await prisma.assets.update({
      where: { id: jpyCash?.id },
      data: {
        amount: jpyCashAmount,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

// データ更新をトリガーに日本円現金を自動で再計算する
const extendedPrisma = prisma.$extends({
  query: {
    assets: {
      async create({ args, query }) {
        const result = await query(args);
        await updateJpyCash();
        return result;
      },
      async update({ args, query }) {
        const result = await query(args);
        await updateJpyCash();
        return result;
      },
      async delete({ args, query }) {
        const result = await query(args);
        await updateJpyCash();
        return result;
      }
    },
    profiles: {
      async create({ args, query }) {
        const result = await query(args);
        await updateJpyCash();
        return result;
      },
      async update({ args, query }) {
        const result = await query(args);
        await updateJpyCash();
        return result;
      }
    },
  }
});

export default extendedPrisma;
