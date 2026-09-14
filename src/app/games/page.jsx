import GamesPageClient from "./GamesPageClient";
import JsonLd from "@/components/JsonLd";
import { getGames } from "@/app/actions/games";

const title = "Choose Your Games";
const description =
  "Browse Monopoly, Exploding Kittens, Monopoly Deal, and more. Pick your rental dates, check availability, and book your games — pay via GCash, delivered and returned through Lalamove, Metro Manila only.";

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
    images: ["/img/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/logo.png"],
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
