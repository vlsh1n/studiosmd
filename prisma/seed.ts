import { PrismaClient, DistrictKey } from "@prisma/client";

const prisma = new PrismaClient();

type HallSeed = {
  name: string;
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
  slug: string;
  district_key: DistrictKey;
  name: string;
  address: string;
  phone: string;
  instagram_nickname: string;
  google_maps_url: string;
  yandex_maps_url: string;
  logo_url: string;
  working_hours: string;
  halls: HallSeed[];
};

const studios: StudioSeed[] = [
  {
    slug: "aurora-studio",
    district_key: DistrictKey.botanica,
    name: "Aurora Studio",
    address: "Dacia St, 24",
    phone: "+373-68-000-101",
    instagram_nickname: "aurora.studio",
    google_maps_url: "https://maps.google.com/?q=Dacia+24+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Dacia+24+Chisinau",
    logo_url: "https://images.example.com/studios/aurora/logo.png",
    working_hours: "Mon-Sun: 08:00-22:00",
    halls: [
      {
        name: "Bright Hall",
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
        name: "Loft",
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
    slug: "lumi-studio",
    district_key: DistrictKey.ciocana,
    name: "Lumi Studio",
    address: "Mircea cel Batran St, 12",
    phone: "+373-68-000-202",
    instagram_nickname: "lumi.studio",
    google_maps_url: "https://maps.google.com/?q=Mircea+cel+Batran+12+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Mircea+cel+Batran+12+Chisinau",
    logo_url: "https://images.example.com/studios/lumi/logo.png",
    working_hours: "Mon-Sat: 09:00-21:00, Sun: 10:00-20:00",
    halls: [
      {
        name: "Minimal",
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
        name: "Cyclorama",
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
    slug: "central-studio",
    district_key: DistrictKey.centru,
    name: "Central Studio",
    address: "Pushkin St, 10",
    phone: "+373-68-000-303",
    instagram_nickname: "central.studio",
    google_maps_url: "https://maps.google.com/?q=Pushkin+10+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Pushkin+10+Chisinau",
    logo_url: "https://images.example.com/studios/central/logo.png",
    working_hours: "Mon-Sun: 08:00-23:00",
    halls: [
      {
        name: "Interior",
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
        name: "Big Daylight",
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
    slug: "loftic-studio",
    district_key: DistrictKey.buiucani,
    name: "Loftic Studio",
    address: "Albisoara St, 7",
    phone: "+373-68-000-404",
    instagram_nickname: "loftic.studio",
    google_maps_url: "https://maps.google.com/?q=Albisoara+7+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Albisoara+7+Chisinau",
    logo_url: "https://images.example.com/studios/loftic/logo.png",
    working_hours: "Tue-Sun: 10:00-22:00",
    halls: [
      {
        name: "Dark Loft",
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
        name: "Bright Minimal",
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
    slug: "north-studio",
    district_key: DistrictKey.riscani,
    name: "North Studio",
    address: "Studenteasca St, 5",
    phone: "+373-68-000-505",
    instagram_nickname: "north.studio",
    google_maps_url: "https://maps.google.com/?q=Studenteasca+5+Chisinau",
    yandex_maps_url: "https://yandex.com/maps/?text=Studenteasca+5+Chisinau",
    logo_url: "https://images.example.com/studios/north/logo.png",
    working_hours: "Mon-Fri: 09:00-20:00, Sat-Sun: 10:00-20:00",
    halls: [
      {
        name: "Portrait",
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
        name: "Big Video",
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
        slug: studio.slug,
        name: studio.name,
        address: studio.address,
        district_key: studio.district_key,
        phone: studio.phone,
        instagram_nickname: studio.instagram_nickname,
        google_maps_url: studio.google_maps_url,
        yandex_maps_url: studio.yandex_maps_url,
        logo_url: studio.logo_url,
        working_hours: studio.working_hours,
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
