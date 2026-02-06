"use server";

import { Daylight, DistrictKey, VideoFriendly } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/db/prisma";

function getEnvAdminToken() {
  const token = process.env.ADMIN_TOKEN?.trim();
  return token && token.length > 0 ? token : null;
}

function isValidAdminToken(token: string) {
  const envToken = getEnvAdminToken();
  if (!envToken) return false;
  return token.length > 0 && token === envToken;
}

function readString(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function parseUrlList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\//i.test(item));
}

function parseTags(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function parsePositiveInt(value: string) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export async function createStudioAction(formData: FormData) {
  const token = readString(formData, "token");
  if (!isValidAdminToken(token)) {
    redirect("/admin");
  }

  const districtRaw = readString(formData, "district_key");
  const districtValues = new Set(Object.values(DistrictKey));
  const district = districtValues.has(districtRaw as DistrictKey)
    ? (districtRaw as DistrictKey)
    : DistrictKey.centru;

  const name_i18n = {
    ru: readString(formData, "studio_name_ru"),
    ro: readString(formData, "studio_name_ro"),
    en: readString(formData, "studio_name_en"),
  };

  const address_i18n = {
    ru: readString(formData, "studio_address_ru"),
    ro: readString(formData, "studio_address_ro"),
    en: readString(formData, "studio_address_en"),
  };

  const cover_images = parseUrlList(readString(formData, "cover_images"));

  const contacts = {
    phone: readString(formData, "studio_phone"),
    instagram: readString(formData, "studio_instagram"),
  };

  await prisma.studio.create({
    data: {
      name_i18n,
      address_i18n,
      district_key: district,
      cover_images,
      contacts,
    },
  });

  redirect(`/admin?token=${encodeURIComponent(token)}&ok=studio`);
}

export async function createHallAction(formData: FormData) {
  const token = readString(formData, "token");
  if (!isValidAdminToken(token)) {
    redirect("/admin");
  }

  const pricePerHour = parsePositiveInt(readString(formData, "price_per_hour"));
  if (!pricePerHour) {
    redirect(`/admin?token=${encodeURIComponent(token)}&error=price`);
  }

  const daylightRaw = readString(formData, "daylight");
  const videoRaw = readString(formData, "video_friendly");

  const studioId = readString(formData, "studio_id");
  const weekendPrice = parsePositiveInt(readString(formData, "weekend_price"));

  const hallData: Record<string, unknown> = {
    studioId,
    name_i18n: {
      ru: readString(formData, "hall_name_ru"),
      ro: readString(formData, "hall_name_ro"),
      en: readString(formData, "hall_name_en"),
    },
    images: parseUrlList(readString(formData, "hall_images")),
    price_per_hour: pricePerHour,
    daylight: daylightRaw === "yes" ? Daylight.yes : Daylight.no,
    video_friendly: videoRaw === "yes" ? VideoFriendly.yes : VideoFriendly.no,
    props_available: formData.get("props_available") === "on",
    flash_available: formData.get("flash_available") === "on",
    continuous_available: formData.get("continuous_available") === "on",
    tags: parseTags(readString(formData, "tags")),
  };

  if (weekendPrice) {
    hallData.weekend_price = weekendPrice;
  }

  await prisma.hall.create({ data: hallData as never });

  redirect(`/admin?token=${encodeURIComponent(token)}&ok=hall`);
}
