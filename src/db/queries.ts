import type { DistrictKey, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import type { Locale } from "@/i18n";

type ListHallsParams = {
  locale: Locale;
  q?: string;
  district_keys?: DistrictKey[];
  tags?: string[];
  price_min?: number;
  price_max?: number;
};

type I18nObject = Record<string, unknown> | null | undefined;

export function getI18n(obj: I18nObject, locale: Locale): string {
  if (!obj || typeof obj !== "object") {
    return "";
  }

  const value = obj[locale];
  return typeof value === "string" ? value : "";
}

export async function listHalls(params: ListHallsParams) {
  const where: Prisma.HallWhereInput = {};

  if (params.tags && params.tags.length > 0) {
    where.tags = { hasSome: params.tags };
  }

  if (typeof params.price_min === "number" || typeof params.price_max === "number") {
    where.price_per_hour = {};
    if (typeof params.price_min === "number") {
      where.price_per_hour.gte = params.price_min;
    }
    if (typeof params.price_max === "number") {
      where.price_per_hour.lte = params.price_max;
    }
  }

  if (params.district_keys && params.district_keys.length > 0) {
    where.studio = {
      district_key: { in: params.district_keys },
    };
  }

  const halls = await prisma.hall.findMany({
    where,
    include: {
      studio: {
        select: {
          id: true,
          name_i18n: true,
          address_i18n: true,
          district_key: true,
          cover_images: true,
        },
      },
    },
    orderBy: {
      price_per_hour: "asc",
    },
  });

  const query = params.q?.trim().toLowerCase();
  if (!query) {
    return halls;
  }

  return halls.filter((hall) => {
    const hallName = getI18n(hall.name_i18n as I18nObject, params.locale).toLowerCase();
    const studioName = getI18n(hall.studio?.name_i18n as I18nObject, params.locale).toLowerCase();
    return hallName.includes(query) || studioName.includes(query);
  });
}

export async function getStudioById(id: string, locale: Locale) {
  const studio = await prisma.studio.findUnique({
    where: { id },
    include: {
      halls: {
        orderBy: {
          price_per_hour: "asc",
        },
      },
    },
  });

  if (!studio) {
    return null;
  }

  return {
    ...studio,
    name: getI18n(studio.name_i18n as I18nObject, locale),
    address: getI18n(studio.address_i18n as I18nObject, locale),
    halls: studio.halls.map((hall) => ({
      ...hall,
      name: getI18n(hall.name_i18n as I18nObject, locale),
    })),
  };
}
