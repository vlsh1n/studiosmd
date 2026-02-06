import { PrismaClient, DistrictKey, Daylight, VideoFriendly } from "@prisma/client";

const prisma = new PrismaClient();

type LocaleKey = "ru" | "ro" | "en";

type HallSeed = {
  name_i18n: Record<LocaleKey, string>;
  images: string[];
  size_m2?: number;
  minimum_hours: number;
  weekend_price?: number;
  daylight: Daylight;
  video_friendly: VideoFriendly;
  area_sqm: number;
  props_available: boolean;
  equipment_available: boolean;
  flash_available: boolean;
  continuous_available: boolean;
  tags: string[];
  price_per_hour: number;
};

type StudioSeed = {
  district_key: DistrictKey;
  name_i18n: Record<LocaleKey, string>;
  address_i18n: Record<LocaleKey, string>;
  cover_images: string[];
  contacts: Record<string, string>;
  halls: HallSeed[];
};

const studios: StudioSeed[] = [
  {
    district_key: DistrictKey.botanica,
    name_i18n: {
      ru: "Студия Aurora",
      ro: "Studio Aurora",
      en: "Aurora Studio",
    },
    address_i18n: {
      ru: "ул. Дачия, 24",
      ro: "str. Dacia, 24",
      en: "Dacia St, 24",
    },
    cover_images: [
      "https://images.example.com/studios/aurora/cover-1.jpg",
      "https://images.example.com/studios/aurora/cover-2.jpg",
    ],
    contacts: {
      phone: "+373-68-000-101",
      email: "hello@aurora.md",
      instagram: "@aurora.studio",
    },
    halls: [
      {
        name_i18n: {
          ru: "Светлый зал",
          ro: "Sala luminoasa",
          en: "Bright Hall",
        },
        images: [
          "https://images.example.com/studios/aurora/hall-bright-1.jpg",
          "https://images.example.com/studios/aurora/hall-bright-2.jpg",
          "https://images.example.com/studios/aurora/hall-bright-3.jpg",
          "https://images.example.com/studios/aurora/hall-bright-4.jpg",
          "https://images.example.com/studios/aurora/hall-bright-5.jpg",
          "https://images.example.com/studios/aurora/hall-bright-6.jpg",
        ],
        size_m2: 70,
        area_sqm: 72,
        minimum_hours: 2,
        weekend_price: 900,
        daylight: Daylight.yes,
        video_friendly: VideoFriendly.no,
        props_available: true,
        equipment_available: true,
        flash_available: true,
        continuous_available: false,
        tags: ["bright", "daylight", "portrait", "content", "spacious", "sunny_morning"],
        price_per_hour: 700,
      },
      {
        name_i18n: {
          ru: "Лофт",
          ro: "Loft",
          en: "Loft",
        },
        images: [
          "https://images.example.com/studios/aurora/hall-loft-1.jpg",
          "https://images.example.com/studios/aurora/hall-loft-2.jpg",
          "https://images.example.com/studios/aurora/hall-loft-3.jpg",
          "https://images.example.com/studios/aurora/hall-loft-4.jpg",
          "https://images.example.com/studios/aurora/hall-loft-5.jpg",
        ],
        size_m2: 55,
        area_sqm: 54,
        minimum_hours: 1,
        daylight: Daylight.no,
        video_friendly: VideoFriendly.yes,
        props_available: false,
        equipment_available: true,
        flash_available: true,
        continuous_available: true,
        tags: ["loft", "dark", "classic", "content"],
        price_per_hour: 550,
      },
    ],
  },
  {
    district_key: DistrictKey.ciocana,
    name_i18n: {
      ru: "Студия Lumi",
      ro: "Studio Lumi",
      en: "Lumi Studio",
    },
    address_i18n: {
      ru: "ул. Мирчи чел Бэтрын, 12",
      ro: "str. Mircea cel Batran, 12",
      en: "Mircea cel Batran St, 12",
    },
    cover_images: [
      "https://images.example.com/studios/lumi/cover-1.jpg",
      "https://images.example.com/studios/lumi/cover-2.jpg",
    ],
    contacts: {
      phone: "+373-68-000-202",
      email: "hello@lumi.md",
      instagram: "@lumi.studio",
    },
    halls: [
      {
        name_i18n: {
          ru: "Минимал",
          ro: "Minimal",
          en: "Minimal",
        },
        images: [
          "https://images.example.com/studios/lumi/hall-minimal-1.jpg",
          "https://images.example.com/studios/lumi/hall-minimal-2.jpg",
          "https://images.example.com/studios/lumi/hall-minimal-3.jpg",
          "https://images.example.com/studios/lumi/hall-minimal-4.jpg",
          "https://images.example.com/studios/lumi/hall-minimal-5.jpg",
        ],
        size_m2: 40,
        area_sqm: 38,
        minimum_hours: 1,
        weekend_price: 520,
        daylight: Daylight.no,
        video_friendly: VideoFriendly.no,
        props_available: true,
        equipment_available: false,
        flash_available: false,
        continuous_available: false,
        tags: ["minimal", "bright", "classic", "portrait"],
        price_per_hour: 420,
      },
      {
        name_i18n: {
          ru: "Циклорама",
          ro: "Cyclorama",
          en: "Cyclorama",
        },
        images: [
          "https://images.example.com/studios/lumi/hall-cyclo-1.jpg",
          "https://images.example.com/studios/lumi/hall-cyclo-2.jpg",
          "https://images.example.com/studios/lumi/hall-cyclo-3.jpg",
          "https://images.example.com/studios/lumi/hall-cyclo-4.jpg",
          "https://images.example.com/studios/lumi/hall-cyclo-5.jpg",
          "https://images.example.com/studios/lumi/hall-cyclo-6.jpg",
        ],
        size_m2: 65,
        area_sqm: 68,
        minimum_hours: 3,
        weekend_price: 1000,
        daylight: Daylight.yes,
        video_friendly: VideoFriendly.yes,
        props_available: false,
        equipment_available: true,
        flash_available: true,
        continuous_available: true,
        tags: ["cyclorama", "content", "product", "daylight", "spacious", "high_ceiling"],
        price_per_hour: 800,
      },
    ],
  },
  {
    district_key: DistrictKey.centru,
    name_i18n: {
      ru: "Студия Central",
      ro: "Studio Central",
      en: "Central Studio",
    },
    address_i18n: {
      ru: "ул. Пушкина, 10",
      ro: "str. Puskin, 10",
      en: "Pushkin St, 10",
    },
    cover_images: [
      "https://images.example.com/studios/central/cover-1.jpg",
      "https://images.example.com/studios/central/cover-2.jpg",
    ],
    contacts: {
      phone: "+373-68-000-303",
      email: "hello@central.md",
      instagram: "@central.studio",
    },
    halls: [
      {
        name_i18n: {
          ru: "Интерьерный",
          ro: "Interior",
          en: "Interior",
        },
        images: [
          "https://images.example.com/studios/central/hall-interior-1.jpg",
          "https://images.example.com/studios/central/hall-interior-2.jpg",
          "https://images.example.com/studios/central/hall-interior-3.jpg",
          "https://images.example.com/studios/central/hall-interior-4.jpg",
          "https://images.example.com/studios/central/hall-interior-5.jpg",
        ],
        size_m2: 50,
        area_sqm: 49,
        minimum_hours: 2,
        daylight: Daylight.no,
        video_friendly: VideoFriendly.no,
        props_available: true,
        equipment_available: false,
        flash_available: false,
        continuous_available: false,
        tags: ["classic", "dark", "portrait", "fashion", "colored_walls"],
        price_per_hour: 480,
      },
      {
        name_i18n: {
          ru: "Большой дневной",
          ro: "Zi mare",
          en: "Big Daylight",
        },
        images: [
          "https://images.example.com/studios/central/hall-daylight-1.jpg",
          "https://images.example.com/studios/central/hall-daylight-2.jpg",
          "https://images.example.com/studios/central/hall-daylight-3.jpg",
          "https://images.example.com/studios/central/hall-daylight-4.jpg",
          "https://images.example.com/studios/central/hall-daylight-5.jpg",
          "https://images.example.com/studios/central/hall-daylight-6.jpg",
        ],
        size_m2: 90,
        area_sqm: 78,
        minimum_hours: 2,
        weekend_price: 1150,
        daylight: Daylight.yes,
        video_friendly: VideoFriendly.no,
        props_available: true,
        equipment_available: true,
        flash_available: true,
        continuous_available: false,
        tags: ["daylight", "bright", "fashion", "spacious", "sunny_evening", "changing_room"],
        price_per_hour: 900,
      },
    ],
  },
  {
    district_key: DistrictKey.buiucani,
    name_i18n: {
      ru: "Студия Loftic",
      ro: "Studio Loftic",
      en: "Loftic Studio",
    },
    address_i18n: {
      ru: "ул. Албишоара, 7",
      ro: "str. Albisoara, 7",
      en: "Albisoara St, 7",
    },
    cover_images: [
      "https://images.example.com/studios/loftic/cover-1.jpg",
      "https://images.example.com/studios/loftic/cover-2.jpg",
    ],
    contacts: {
      phone: "+373-68-000-404",
      email: "hello@loftic.md",
      instagram: "@loftic.studio",
    },
    halls: [
      {
        name_i18n: {
          ru: "Темный лофт",
          ro: "Loft intunecat",
          en: "Dark Loft",
        },
        images: [
          "https://images.example.com/studios/loftic/hall-dark-1.jpg",
          "https://images.example.com/studios/loftic/hall-dark-2.jpg",
          "https://images.example.com/studios/loftic/hall-dark-3.jpg",
          "https://images.example.com/studios/loftic/hall-dark-4.jpg",
          "https://images.example.com/studios/loftic/hall-dark-5.jpg",
        ],
        size_m2: 60,
        area_sqm: 58,
        minimum_hours: 3,
        daylight: Daylight.no,
        video_friendly: VideoFriendly.yes,
        props_available: false,
        equipment_available: true,
        flash_available: true,
        continuous_available: true,
        tags: ["loft", "dark", "content", "classic", "texture_walls"],
        price_per_hour: 600,
      },
      {
        name_i18n: {
          ru: "Светлый минимал",
          ro: "Minimal luminos",
          en: "Bright Minimal",
        },
        images: [
          "https://images.example.com/studios/loftic/hall-minimal-1.jpg",
          "https://images.example.com/studios/loftic/hall-minimal-2.jpg",
          "https://images.example.com/studios/loftic/hall-minimal-3.jpg",
          "https://images.example.com/studios/loftic/hall-minimal-4.jpg",
          "https://images.example.com/studios/loftic/hall-minimal-5.jpg",
        ],
        size_m2: 45,
        area_sqm: 42,
        minimum_hours: 1,
        weekend_price: 600,
        daylight: Daylight.no,
        video_friendly: VideoFriendly.no,
        props_available: true,
        equipment_available: false,
        flash_available: false,
        continuous_available: false,
        tags: ["minimal", "bright", "portrait", "fashion"],
        price_per_hour: 450,
      },
    ],
  },
  {
    district_key: DistrictKey.riscani,
    name_i18n: {
      ru: "Студия North",
      ro: "Studio Nord",
      en: "North Studio",
    },
    address_i18n: {
      ru: "ул. Студенческая, 5",
      ro: "str. Studenteasca, 5",
      en: "Studenteasca St, 5",
    },
    cover_images: [
      "https://images.example.com/studios/north/cover-1.jpg",
      "https://images.example.com/studios/north/cover-2.jpg",
    ],
    contacts: {
      phone: "+373-68-000-505",
      email: "hello@north.md",
      instagram: "@north.studio",
    },
    halls: [
      {
        name_i18n: {
          ru: "Портретный",
          ro: "Portret",
          en: "Portrait",
        },
        images: [
          "https://images.example.com/studios/north/hall-portrait-1.jpg",
          "https://images.example.com/studios/north/hall-portrait-2.jpg",
          "https://images.example.com/studios/north/hall-portrait-3.jpg",
          "https://images.example.com/studios/north/hall-portrait-4.jpg",
          "https://images.example.com/studios/north/hall-portrait-5.jpg",
        ],
        size_m2: 35,
        area_sqm: 28,
        minimum_hours: 1,
        daylight: Daylight.no,
        video_friendly: VideoFriendly.no,
        props_available: false,
        equipment_available: false,
        flash_available: false,
        continuous_available: false,
        tags: ["portrait", "classic", "family", "small"],
        price_per_hour: 380,
      },
      {
        name_i18n: {
          ru: "Большой видео",
          ro: "Video mare",
          en: "Big Video",
        },
        images: [
          "https://images.example.com/studios/north/hall-video-1.jpg",
          "https://images.example.com/studios/north/hall-video-2.jpg",
          "https://images.example.com/studios/north/hall-video-3.jpg",
          "https://images.example.com/studios/north/hall-video-4.jpg",
          "https://images.example.com/studios/north/hall-video-5.jpg",
          "https://images.example.com/studios/north/hall-video-6.jpg",
        ],
        size_m2: 85,
        area_sqm: 80,
        minimum_hours: 2,
        daylight: Daylight.yes,
        video_friendly: VideoFriendly.yes,
        props_available: true,
        equipment_available: true,
        flash_available: true,
        continuous_available: true,
        tags: ["content", "product", "daylight", "bright", "spacious", "easy_access"],
        price_per_hour: 850,
      },
    ],
  },
];

async function main() {
  const districtKeyValues = new Set(Object.values(DistrictKey));
  const invalidDistrictKeys = studios
    .map((studio) => studio.district_key)
    .filter((value) => !districtKeyValues.has(value));

  if (invalidDistrictKeys.length > 0) {
    throw new Error(`Invalid district_key values: ${invalidDistrictKeys.join(", ")}`);
  }

  await prisma.hall.deleteMany();
  await prisma.studio.deleteMany();

  for (const studio of studios) {
    await prisma.studio.create({
      data: {
        name_i18n: studio.name_i18n,
        address_i18n: studio.address_i18n,
        district_key: studio.district_key,
        cover_images: studio.cover_images,
        contacts: studio.contacts,
        halls: {
          create: studio.halls,
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
