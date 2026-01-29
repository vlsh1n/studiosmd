import { Locale, t } from "@/i18n";

type Props = {
  params: { locale: Locale; id: string };
};

export default function StudioPage({ params }: Props) {
  const { locale, id } = params;

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold text-black">
        {t(locale, "studioTitle")} #{id}
      </h1>
      <p className="text-gray-600">{t(locale, "studioPlaceholder")}</p>
    </section>
  );
}
