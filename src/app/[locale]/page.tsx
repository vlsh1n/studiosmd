import { Locale, t } from "@/i18n";

type Props = {
  params: { locale: Locale };
};

export default function CatalogPage({ params }: Props) {
  const { locale } = params;

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold text-black">
        {t(locale, "catalogTitle")}
      </h1>
      <p className="text-gray-600">{t(locale, "catalogPlaceholder")}</p>
    </section>
  );
}
