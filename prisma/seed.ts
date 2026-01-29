import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const studios = [
  {
    district_key: "botanica",
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
        ],
        size_m2: 70,
        tags: ["bright", "daylight", "portrait", "catalog", "big"],
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
        ],
        size_m2: 55,
        tags: ["loft", "dark", "interior", "video"],
        price_per_hour: 550,
      },
    ],
  },
  {
    district_key: "ciocana",
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
        ],
        size_m2: 40,
        tags: ["minimal", "bright", "interior", "small"],
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
        ],
        size_m2: 65,
        tags: ["cyclorama", "catalog", "video", "big"],
        price_per_hour: 800,
      },
    ],
  },
  {
    district_key: "centru",
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
        ],
        size_m2: 50,
        tags: ["interior", "dark", "portrait", "small"],
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
        ],
        size_m2: 90,
        tags: ["daylight", "bright", "catalog", "big"],
        price_per_hour: 900,
      },
    ],
  },
  {
    district_key: "buiucani",
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
        ],
        size_m2: 60,
        tags: ["loft", "dark", "video", "interior"],
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
        ],
        size_m2: 45,
        tags: ["minimal", "bright", "portrait", "small"],
        price_per_hour: 450,
      },
    ],
  },
  {
    district_key: "riscani",
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
        ],
        size_m2: 35,
        tags: ["portrait", "interior", "small"],
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
        ],
        size_m2: 85,
        tags: ["video", "catalog", "daylight", "big"],
        price_per_hour: 850,
      },
    ],
  },
];

async function main() {
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
