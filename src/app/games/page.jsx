import GamesPageClient from "./GamesPageClient";
import JsonLd from "@/components/JsonLd";
import { getGames } from "@/app/actions/games";

const title = "Rent Board Games in Metro Manila";
const description =
  "Rent Monopoly, Exploding Kittens, Monopoly Deal, and more board games in Metro Manila. Pick your rental dates, check availability, and book online — pay via GCash, delivered and returned through Lalamove.";

export const metadata = {
  title,
  description,
  alternates: {
    canonical: "/games",
  },
  openGraph: {
    title,
    description,
    url: "/games",
    siteName: "Unboxed",
    locale: "en_PH",
    type: "website",
    images: ["/img/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/og-image.jpg"],
  },
};

export default async function GamesPage({ searchParams }) {
  const games = await getGames();
  const params = await searchParams;
  const initialAddSlug =
    typeof params?.add === "string" ? params.add : undefined;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: games.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: game.name,
        description: game.shortDescription,
        image: game.imageSrc ?? undefined,
        offers: {
          "@type": "Offer",
          price: game.pricePerDay,
          priceCurrency: "PHP",
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <GamesPageClient games={games} initialAddSlug={initialAddSlug} />
    </>
  );
}
