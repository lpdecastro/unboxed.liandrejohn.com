const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function GET() {
  const body = `# Unboxed

> Personal board game rental service in Metro Manila. Rent from a small
> collection of 8 games, pay via GCash, and get delivery/returns via
> Lalamove.

## Games

Monopoly, Exploding Kittens, Monopoly Deal, Herd Mentality, Piles, Game of
Life, RC Plane, Jackstones.

## How it works

- Pick your rental dates and check which games are available.
- Add one or more games to your booking (2+ games get a 10% discount on
  rental fees).
- Pay the rental fee and refundable security deposit via GCash.
- Delivery and return are handled via Lalamove; the renter pays the
  Lalamove fees. Metro Manila only.
- Bookings are confirmed manually after GCash payment is verified.

## Pages

- [Homepage](${siteUrl}/): overview, featured games, how it works, FAQ.
- [Browse Games](${siteUrl}/games): full game catalog, availability
  checker, and booking flow.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
