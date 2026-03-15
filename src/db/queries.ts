import type { DistrictKey, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import type { Locale } from "@/i18n";
import { slugifyStudioName } from "@/seo/studio";

type ListHallsParams = {
  locale: Locale;
  q?: string;
  district_keys?: DistrictKey[];
  tags?: string[];
  facts?: HallFactFilterKey[];
  sort?: "price_asc" | "price_desc";
  take?: number;
  skip?: number;
};

type HallFactFilterKey =
  | "daylight"
  | "blackout"
  | "parking"
  | "changing_room"
  | "furniture"
  | "flash_light"
  | "continuous_light"
  | "cyclorama";

type HallWithStudio = Prisma.HallGetPayload<{
  include: {
    studio: {
      select: {
        id: true;
        name_i18n: true;
        address_i18n: true;
        district_key: true;
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
  const andFilters: Prisma.HallWhereInput[] = [];

  if (params.tags && params.tags.length > 0) {
    andFilters.push({ tags: { hasEvery: params.tags } });
  }

  if (params.facts && params.facts.length > 0) {
    for (const fact of params.facts) {
      if (fact === "daylight") {
        andFilters.push({ daylight: true });
        continue;
      }
      if (fact === "blackout") {
        andFilters.push({ blackout: true });
        continue;
      }
      if (fact === "parking") {
        andFilters.push({ parking: true });
        continue;
      }
      if (fact === "changing_room") {
        andFilters.push({ changing_room: true });
        continue;
      }
      if (fact === "furniture") {
        andFilters.push({ furniture: true });
        continue;
      }
      if (fact === "flash_light") {
        andFilters.push({ flash_light: true });
        continue;
      }
      if (fact === "continuous_light") {
        andFilters.push({ continuous_light: true });
        continue;
      }
      if (fact === "cyclorama") {
        andFilters.push({ cyclorama: true });
      }
    }
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

  if (andFilters.length > 0) {
    where.AND = andFilters;
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
        },
      },
    },
    orderBy: [
      {
        price_per_hour: {
          sort: params.sort === "price_desc" ? "desc" : "asc",
          nulls: "last",
        },
      },
      { id: "asc" },
    ],
    take: params.take,
    skip: params.skip,
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
        orderBy: [
          {
            price_per_hour: {
              sort: "asc",
              nulls: "last",
            },
          },
          {
            id: "asc",
          },
        ],
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

export async function getStudioBySlug(slug: string, locale: Locale) {
  const studios = await prisma.studio.findMany({
    include: {
      halls: {
        orderBy: [
          {
            price_per_hour: {
              sort: "asc",
              nulls: "last",
            },
          },
          {
            id: "asc",
          },
        ],
      },
    },
  });

  const match = studios.find((studio) => {
    const nameRo = getI18n(studio.name_i18n as I18nObject, "ro");
    const nameRu = getI18n(studio.name_i18n as I18nObject, "ru");
    const nameEn = getI18n(studio.name_i18n as I18nObject, "en");
    return (
      slugifyStudioName(nameRo) === slug ||
      slugifyStudioName(nameRu) === slug ||
      slugifyStudioName(nameEn) === slug
    );
  });

  if (!match) {
    return null;
  }

  return {
    ...match,
    name: getI18n(match.name_i18n as I18nObject, locale),
    address: getI18n(match.address_i18n as I18nObject, locale),
    halls: match.halls.map((hall) => ({
      ...hall,
      name: getI18n(hall.name_i18n as I18nObject, locale),
    })),
  };
}

export async function listHallRouteEntries(locale: Locale) {
  const halls = await prisma.hall.findMany({
    select: {
      id: true,
      name_i18n: true,
      studio: {
        select: {
          id: true,
          name_i18n: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return halls.map((hall) => ({
    id: hall.id,
    name: getI18n(hall.name_i18n as I18nObject, locale),
    studio: {
      id: hall.studio.id,
      name: getI18n(hall.studio.name_i18n as I18nObject, locale),
    },
  }));
}
