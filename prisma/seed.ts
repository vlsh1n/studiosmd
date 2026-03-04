import { PrismaClient, DistrictKey } from "@prisma/client";

const prisma = new PrismaClient();

type LocaleKey = "ru" | "ro" | "en";

type HallSeed = {
  name_i18n: Record<LocaleKey, string>;
  images: string[];
  weekend_price?: number;
  daylight: boolean;
  blackout?: boolean;
  parking?: boolean;
  changing_room?: boolean;
  area_sqm: number;
  high_ceiling: number | null;
  furniture: boolean;
  flash_light: boolean;
  continuous_light: boolean;
  cyclorama?: boolean;
  tags: string[];
  price_per_hour?: number | null;
};

type StudioSeed = {
  district_key: DistrictKey;
  name_i18n: Record<LocaleKey, string>;
  address_i18n: Record<LocaleKey, string>;
  phone: string;
  instagram_nickname: string;
  google_maps_url: string;
  yandex_maps_url: string;
  logo_url: string;
  working_hours_i18n: Record<LocaleKey, string>;
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
    phone: "+373-68-000-101",
    instagram_nickname: "aurora.studio",
    google_maps_url: "https://maps.google.com/?q=Dacia+24+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Dacia+24+Chisinau",
    logo_url: "https://images.example.com/studios/aurora/logo.png",
    working_hours_i18n: {
      ru: "Пн-Вс: 08:00-22:00",
      ro: "Lun-Dum: 08:00-22:00",
      en: "Mon-Sun: 08:00-22:00",
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
        area_sqm: 72,
        high_ceiling: null,
        weekend_price: 900,
        daylight: true,
        furniture: true,
        flash_light: true,
        continuous_light: false,
        tags: ["bright", "portrait", "content", "spacious", "sunny_morning"],
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
        area_sqm: 54,
        high_ceiling: null,
        daylight: false,
        furniture: false,
        flash_light: true,
        continuous_light: true,
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
    phone: "+373-68-000-202",
    instagram_nickname: "lumi.studio",
    google_maps_url: "https://maps.google.com/?q=Mircea+cel+Batran+12+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Mircea+cel+Batran+12+Chisinau",
    logo_url: "https://images.example.com/studios/lumi/logo.png",
    working_hours_i18n: {
      ru: "Пн-Сб: 09:00-21:00, Вс: 10:00-20:00",
      ro: "Lun-Sam: 09:00-21:00, Dum: 10:00-20:00",
      en: "Mon-Sat: 09:00-21:00, Sun: 10:00-20:00",
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
        area_sqm: 38,
        high_ceiling: null,
        weekend_price: 520,
        daylight: false,
        furniture: true,
        flash_light: false,
        continuous_light: false,
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
        area_sqm: 68,
        high_ceiling: 4,
        weekend_price: 1000,
        daylight: true,
        furniture: false,
        flash_light: true,
        continuous_light: true,
        cyclorama: true,
        tags: ["content", "product", "spacious"],
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
    phone: "+373-68-000-303",
    instagram_nickname: "central.studio",
    google_maps_url: "https://maps.google.com/?q=Pushkin+10+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Pushkin+10+Chisinau",
    logo_url: "https://images.example.com/studios/central/logo.png",
    working_hours_i18n: {
      ru: "Пн-Вс: 08:00-23:00",
      ro: "Lun-Dum: 08:00-23:00",
      en: "Mon-Sun: 08:00-23:00",
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
        area_sqm: 49,
        high_ceiling: null,
        daylight: false,
        furniture: true,
        flash_light: false,
        continuous_light: false,
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
        area_sqm: 78,
        high_ceiling: null,
        weekend_price: 1150,
        daylight: true,
        changing_room: true,
        furniture: true,
        flash_light: true,
        continuous_light: false,
        tags: ["bright", "fashion", "spacious", "sunny_evening"],
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
    phone: "+373-68-000-404",
    instagram_nickname: "loftic.studio",
    google_maps_url: "https://maps.google.com/?q=Albisoara+7+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Albisoara+7+Chisinau",
    logo_url: "https://images.example.com/studios/loftic/logo.png",
    working_hours_i18n: {
      ru: "Вт-Вс: 10:00-22:00",
      ro: "Mar-Dum: 10:00-22:00",
      en: "Tue-Sun: 10:00-22:00",
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
        area_sqm: 58,
        high_ceiling: null,
        daylight: false,
        furniture: false,
        flash_light: true,
        continuous_light: true,
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
        area_sqm: 42,
        high_ceiling: null,
        weekend_price: 600,
        daylight: false,
        furniture: true,
        flash_light: false,
        continuous_light: false,
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
    phone: "+373-68-000-505",
    instagram_nickname: "north.studio",
    google_maps_url: "https://maps.google.com/?q=Studenteasca+5+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Studenteasca+5+Chisinau",
    logo_url: "https://images.example.com/studios/north/logo.png",
    working_hours_i18n: {
      ru: "Пн-Пт: 09:00-20:00, Сб-Вс: 10:00-20:00",
      ro: "Lun-Vin: 09:00-20:00, Sam-Dum: 10:00-20:00",
      en: "Mon-Fri: 09:00-20:00, Sat-Sun: 10:00-20:00",
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
        area_sqm: 28,
        high_ceiling: null,
        daylight: false,
        furniture: false,
        flash_light: false,
        continuous_light: false,
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
        area_sqm: 80,
        high_ceiling: null,
        daylight: true,
        furniture: true,
        flash_light: true,
        continuous_light: true,
        tags: ["content", "product", "bright", "spacious"],
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
        phone: studio.phone,
        instagram_nickname: studio.instagram_nickname,
        google_maps_url: studio.google_maps_url,
        yandex_maps_url: studio.yandex_maps_url,
        logo_url: studio.logo_url,
        working_hours_i18n: studio.working_hours_i18n,
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
