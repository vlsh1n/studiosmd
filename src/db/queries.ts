import type { DistrictKey, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import type { Locale } from "@/i18n";

type ListHallsParams = {
  locale: Locale;
  q?: string;
  district_keys?: DistrictKey[];
  tags?: string[];
  sort?: "price_asc" | "price_desc";
};

type HallWithStudio = Prisma.HallGetPayload<{
  include: {
    studio: {
      select: {
        id: true;
        name_i18n: true;
        address_i18n: true;
        district_key: true;
        cover_images: true;
      };
    };
  };
}>;

export type HallListItem = Omit<HallWithStudio, "studio"> & {
  name: string;
  studio: HallWithStudio["studio"] & {
    name: string;
    address: string;
  };
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
  const query = params.q?.trim();

  if (params.tags && params.tags.length > 0) {
    where.tags = { hasEvery: params.tags };
  }

  if (params.district_keys && params.district_keys.length > 0) {
    where.studio = {
      district_key: { in: params.district_keys },
    };
  }

  if (query) {
    where.OR = [
      {
        name_i18n: {
          path: [params.locale],
          string_contains: query,
          mode: "insensitive",
        },
      },
      {
        studio: {
          name_i18n: {
            path: [params.locale],
            string_contains: query,
            mode: "insensitive",
          },
        },
      },
    ];
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
      price_per_hour: params.sort === "price_desc" ? "desc" : "asc",
    },
  });

  return halls.map((hall) => ({
    ...hall,
    area_sqm: hall.area_sqm,
    name: getI18n(hall.name_i18n as I18nObject, params.locale),
    studio: {
      ...hall.studio,
      name: getI18n(hall.studio?.name_i18n as I18nObject, params.locale),
      address: getI18n(hall.studio?.address_i18n as I18nObject, params.locale),
    },
  }));
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
