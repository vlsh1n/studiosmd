import type { DistrictKey, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";

type ListHallsParams = {
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
        name: true;
        address: true;
        district_key: true;
      };
    };
  };
}>;

export type HallListItem = HallWithStudio;

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
      { name: { contains: query, mode: "insensitive" } },
      { studio: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (andFilters.length > 0) {
    where.AND = andFilters;
  }

  return prisma.hall.findMany({
    where,
    include: {
      studio: {
        select: {
          id: true,
          name: true,
          address: true,
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
}

export async function listStudios() {
  return prisma.studio.findMany({
    select: { name: true, slug: true },
    orderBy: { id: "asc" },
  });
}

export async function getStudioBySlug(slug: string) {
  return prisma.studio.findUnique({
    where: { slug },
    include: {
      halls: {
        orderBy: [
          { price_per_hour: { sort: "asc", nulls: "last" } },
          { id: "asc" },
        ],
      },
    },
  });
}

export async function listHallRouteEntries() {
  const halls = await prisma.hall.findMany({
    select: {
      id: true,
      name: true,
      studio: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
    orderBy: { id: "asc" },
  });

  return halls;
}
