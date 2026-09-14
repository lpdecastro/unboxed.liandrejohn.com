import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RentalPoliciesModal from "@/components/RentalPoliciesModal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { getGames } from "@/app/actions/games";

const featuredSlugs = [
  "monopoly",
  "exploding-kittens",
  "monopoly-deal",
  "herd-mentality",
];

export default async function HomePage() {
  const games = await getGames();
  const featuredGames = featuredSlugs.map((slug) =>
    games.find((game) => game.slug === slug)
  );

  const renderFeaturedCard = (game) => (
    <div className="card border-0 shadow-sm">
      <div className="ratio ratio-1x1 rounded-top-4 overflow-hidden position-relative">
        <Image
          src={game.imageSrc}
          alt={game.imageAlt}
          fill
          sizes="(min-width: 992px) 25vw, (min-width: 576px) 50vw, 100vw"
          className="object-fit-cover"
        />
      </div>
      <div className="card-body d-flex flex-column h-100 p-4">
        <h3 className="h4 card-title mb-2">{game.name}</h3>
        <p className="text-body-secondary card-desc-clamp mb-3">
          {game.shortDescription}
        </p>
        <p className="mb-2">
          <span className="fs-4 fw-bold">&#8369;{game.pricePerDay}</span>
          <span className="text-body-secondary">/day</span>
        </p>
        <ul className="list-unstyled small text-body-secondary mb-4">
          <li className="mb-1">
            <i className="bi bi-people me-2"></i>
            {game.players}
          </li>
          <li>
            <i className="bi bi-clock me-2"></i>
            {game.playTime}
          </li>
        </ul>
        <Link
          href={`/games?add=${game.slug}`}
          className="btn btn-primary rounded-pill mt-auto"
        >
          <i className="bi bi-plus-circle me-2"></i>Add to Booking
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <Navbar active="home" />

      <main className="flex-grow-1">
        {/* Hero */}
        <section className="py-6">
          <div className="container py-lg-4">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <p className="text-uppercase text-primary fw-semibold small ls-wide mb-2">
                  Personal Board Game Rentals in Metro Manila
                </p>
                <h1 className="display-4 fw-bold mb-3">
                  Game night without{" "}
                  <span className="text-primary">buying the game.</span>
                </h1>
                <p className="lead text-body-secondary mb-4">
                  I&rsquo;m sharing my small personal collection of 8 games
                  for family nights, dates, parties, and weekend hangouts.
                  Pick your dates, pay through GCash, and have your games
                  delivered through Lalamove.
                </p>
                <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                  <Link
                    href="/games"
                    className="btn btn-primary btn-lg fw-semibold rounded-pill px-4"
                  >
                    Browse Games
                  </Link>
                </div>
                <p className="small text-body-secondary mb-0">
                  Rentals from &#8369;50/day{" "}
                  <span className="mx-1">&bull;</span> Metro Manila only
                  <span className="mx-1">&bull;</span> Refundable security
                  deposit
                </p>
              </div>
              <div className="col-lg-6">
                <div className="position-relative">
                  <div className="ratio ratio-4x3 rounded-4 shadow overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1640461470346-c8b56497850a?auto=format&fit=crop&w=900&q=80"
                      alt="Board game set up on a table for game night"
                      className="object-fit-cover w-100 h-100"
                    />
                  </div>
                  <span className="badge bg-accent text-dark rounded-pill fs-6 fw-semibold px-3 py-2 shadow position-absolute bottom-0 start-0 m-3">
                    From &#8369;50/day
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Games */}
        <section className="py-5 py-lg-6 bg-body-tertiary" id="games">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <p className="text-uppercase text-primary fw-semibold small ls-wide mb-2">
                  My Collection
                </p>
                <h2 className="fs-1 mb-3">Pick something for game night</h2>
                <p className="text-body-secondary">
                  These are games from my own collection. I only have one
                  copy of each, so availability depends on your rental
                  dates.
                </p>
              </div>
            </div>

            {/* Mobile: swipeable carousel, one game per slide */}
            <div className="d-sm-none mt-3">
              <div
                id="featuredGamesCarousel"
                className="carousel slide carousel-dark featured-games-carousel"
              >
                <div className="position-relative">
                  <div className="carousel-inner">
                    {featuredGames.map((game, index) => (
                      <div
                        className={`carousel-item${
                          index === 0 ? " active" : ""
                        }`}
                        key={game.slug}
                      >
                        <div className="px-5">{renderFeaturedCard(game)}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#featuredGamesCarousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#featuredGamesCarousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
                <div className="carousel-indicators">
                  {featuredGames.map((game, index) => (
                    <button
                      key={game.slug}
                      type="button"
                      data-bs-target="#featuredGamesCarousel"
                      data-bs-slide-to={index}
                      className={index === 0 ? "active" : ""}
                      aria-current={index === 0 ? "true" : undefined}
                      aria-label={`Show ${game.name}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tablet and up: grid, unchanged */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mt-3 d-none d-sm-flex">
              {featuredGames.map((game) => (
                <div className="col" key={game.slug}>
                  {renderFeaturedCard(game)}
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <Link
                href="/games"
                className="btn btn-outline-primary rounded-pill px-4"
              >
                View All 8 Games
              </Link>
              <p className="small text-body-secondary mt-3 mb-0">
                Also available: Game of Life, Piles, RC Plane, and
                Jackstones.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-5 py-lg-6" id="how-it-works">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <p className="text-uppercase text-primary fw-semibold small ls-wide mb-2">
                  Simple Rentals
                </p>
                <h2 className="fs-1 mb-3">
                  From my shelf to your game night
                </h2>
                <p className="text-body-secondary">
                  From picking your games to getting them delivered, renting
                  from Unboxed takes just three simple steps.
                </p>
              </div>
            </div>

            <div className="row g-4 mt-0">
              <div className="col-lg-8">
                <div className="d-flex flex-column gap-4">
                  <div className="card h-100 border-0 shadow-sm p-4">
                    <div className="d-flex align-items-start">
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-primary text-white fw-bold fs-5 me-4"
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        1
                      </div>
                      <div>
                        <h3 className="h4 mb-2">Pick your games</h3>
                        <p className="text-body-secondary mb-0">
                          Choose your preferred rental dates, then browse the
                          collection and add the games you&rsquo;d like to
                          book.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card h-100 border-0 shadow-sm p-4">
                    <div className="d-flex align-items-start">
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-primary text-white fw-bold fs-5 me-4"
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        2
                      </div>
                      <div>
                        <h3 className="h4 mb-2">Pay through GCash</h3>
                        <p className="text-body-secondary mb-0">
                          Pay the rental total and refundable security
                          deposit, then enter your GCash reference number.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card h-100 border-0 shadow-sm p-4">
                    <div className="d-flex align-items-start">
                      <div
                        className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-primary text-white fw-bold fs-5 me-4"
                        style={{ width: "3rem", height: "3rem" }}
                      >
                        3
                      </div>
                      <div>
                        <h3 className="h4 mb-2">Receive via Lalamove</h3>
                        <p className="text-body-secondary mb-0">
                          Once I verify and confirm your booking, I&rsquo;ll
                          coordinate the Lalamove delivery with you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div
                  className="card h-100 border-0 shadow-sm text-white p-4 p-lg-5 d-flex flex-column justify-content-center text-center"
                  style={{ backgroundColor: "var(--bs-body-color)" }}
                >
                  <i className="bi bi-calendar2-check display-4 mb-3"></i>
                  <h3 className="h4 mb-3">Ready to book?</h3>
                  <p className="text-white text-opacity-75 mb-4">
                    Check which games are free for your dates and start your
                    booking in minutes.
                  </p>
                  <Link
                    href="/games"
                    className="btn btn-primary fw-semibold rounded-pill px-4"
                  >
                    Check Game Availability
                  </Link>
                </div>
              </div>
            </div>

            <p className="small text-body-secondary mt-4 mb-0 pt-4 border-top">
              <i className="bi bi-info-circle me-1"></i>Lalamove delivery and
              return fees are paid separately by the renter.
            </p>
          </div>
        </section>

        {/* Why Rent From Unboxed */}
        <section className="py-5 py-lg-6 bg-body-tertiary">
          <div className="container">
            <div className="row g-5 align-items-start">
              <div className="col-lg-5">
                <p className="text-uppercase text-primary fw-semibold small ls-wide mb-2">
                  A Small, Personal Collection
                </p>
                <h2 className="fs-1 mb-3">
                  Easy to borrow, cared for personally
                </h2>
                <p className="text-body-secondary mb-0">
                  Unboxed isn&rsquo;t a big rental shop. These are games I
                  personally own and want other people around Metro Manila
                  to enjoy too.
                </p>
              </div>
              <div className="col-lg-7">
                <div className="row row-cols-1 row-cols-sm-2 g-4 mt-0">
                  <div className="col d-flex gap-4">
                    <div
                      className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fs-5"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <i className="bi bi-piggy-bank"></i>
                    </div>
                    <div>
                      <h3 className="h4 mb-3">Spend less for game night</h3>
                      <p className="text-body-secondary mb-0">
                        Rent a game for a few days instead of buying one you
                        might only play occasionally.
                      </p>
                    </div>
                  </div>
                  <div className="col d-flex gap-4">
                    <div
                      className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fs-5"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <i className="bi bi-qr-code"></i>
                    </div>
                    <div>
                      <h3 className="h4 mb-3">Easy GCash payment</h3>
                      <p className="text-body-secondary mb-0">
                        No complicated payment setup&mdash;just scan the QR
                        code and send your payment through GCash.
                      </p>
                    </div>
                  </div>
                  <div className="col d-flex gap-4">
                    <div
                      className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fs-5"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <i className="bi bi-truck"></i>
                    </div>
                    <div>
                      <h3 className="h4 mb-3">Convenient delivery</h3>
                      <p className="text-body-secondary mb-0">
                        Your games can be delivered and returned through
                        Lalamove within Metro Manila.
                      </p>
                    </div>
                  </div>
                  <div className="col d-flex gap-4">
                    <div
                      className="flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fs-5"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <div>
                      <h3 className="h4 mb-3">Refundable deposit</h3>
                      <p className="text-body-secondary mb-0">
                        Your security deposit is returned after the games
                        come back complete and in good condition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rental Highlights */}
        <section className="py-5 py-lg-6">
          <div className="container">
            <div className="row">
              <div className="col-lg-7">
                <p className="text-uppercase text-primary fw-semibold small ls-wide mb-2">
                  Good to Know
                </p>
                <h2 className="fs-1 mb-3">
                  Simple pricing, no hidden delivery charges
                </h2>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mt-0">
              <div className="col">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <i className="bi bi-tag text-primary fs-3 mb-3"></i>
                  <h3 className="h5 mb-2">From &#8369;50/day</h3>
                  <p className="text-body-secondary mb-0">
                    Rental prices depend on the game.
                  </p>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <i className="bi bi-percent text-primary fs-3 mb-3"></i>
                  <h3 className="h5 mb-2">10% off, 2+ games</h3>
                  <p className="text-body-secondary mb-0">
                    The discount applies to rental fees only.
                  </p>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <i className="bi bi-shield-check text-primary fs-3 mb-3"></i>
                  <h3 className="h5 mb-2">Refundable deposit</h3>
                  <p className="text-body-secondary mb-0">
                    Deposits range from &#8369;50 to &#8369;500 depending on
                    the game.
                  </p>
                </div>
              </div>
              <div className="col">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <i className="bi bi-truck text-primary fs-3 mb-3"></i>
                  <h3 className="h5 mb-2">Lalamove paid separately</h3>
                  <p className="text-body-secondary mb-0">
                    Delivery and return fees are not included in your
                    website total.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center small text-body-secondary mt-4 mb-4">
              Rental days are counted inclusively. For example, September
              20&ndash;22 is a 3-day rental.
            </p>
            <div className="text-center">
              <Link
                href="/games"
                className="btn btn-outline-primary rounded-pill px-4"
              >
                Check Prices &amp; Availability
              </Link>
            </div>
          </div>
        </section>

        {/* Rental Policies */}
        <section className="py-5 py-lg-6 bg-body-tertiary">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-5">
                <p className="text-uppercase text-primary fw-semibold small ls-wide mb-2">
                  Before You Book
                </p>
                <h2 className="fs-1 mb-3">A few simple rental rules</h2>
                <p className="text-body-secondary mb-4">
                  I want the process to be straightforward for both of us.
                  Here are the main things to know before booking.
                </p>
                <a
                  href="#rentalPoliciesModal"
                  data-bs-toggle="modal"
                  className="link-primary fw-semibold"
                >
                  View Full Rental Policies{" "}
                  <i className="bi bi-arrow-up-right ms-1"></i>
                </a>
              </div>
              <div className="col-lg-7">
                <div className="accordion accordion-flush" id="policyAccordion">
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#policy1"
                      >
                        <i className="bi bi-credit-card me-2"></i>Payment
                        &amp; confirmation
                      </button>
                    </h3>
                    <div
                      id="policy1"
                      className="accordion-collapse collapse"
                      data-bs-parent="#policyAccordion"
                    >
                      <div className="accordion-body text-body-secondary">
                        Full payment and the security deposit are required
                        through GCash. Your booking is confirmed only after
                        I verify the payment.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#policy2"
                      >
                        <i className="bi bi-x-circle me-2"></i>Cancellations
                      </button>
                    </h3>
                    <div
                      id="policy2"
                      className="accordion-collapse collapse"
                      data-bs-parent="#policyAccordion"
                    >
                      <div className="accordion-body text-body-secondary">
                        You can cancel while your booking is still pending.
                        Once confirmed, the rental payment is
                        non-refundable.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#policy3"
                      >
                        <i className="bi bi-shield-check me-2"></i>Security
                        deposit
                      </button>
                    </h3>
                    <div
                      id="policy3"
                      className="accordion-collapse collapse"
                      data-bs-parent="#policyAccordion"
                    >
                      <div className="accordion-body text-body-secondary">
                        Your deposit is refunded after the games are
                        returned and inspected.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#policy4"
                      >
                        <i className="bi bi-clock-history me-2"></i>Late
                        returns
                      </button>
                    </h3>
                    <div
                      id="policy4"
                      className="accordion-collapse collapse"
                      data-bs-parent="#policyAccordion"
                    >
                      <div className="accordion-body text-body-secondary">
                        Late fees are charged per day based on the game you
                        rented.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#policy5"
                      >
                        <i className="bi bi-tools me-2"></i>Damage or
                        missing pieces
                      </button>
                    </h3>
                    <div
                      id="policy5"
                      className="accordion-collapse collapse"
                      data-bs-parent="#policyAccordion"
                    >
                      <div className="accordion-body text-body-secondary">
                        Charges for damaged or missing items may be deducted
                        from the security deposit.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#policy6"
                      >
                        <i className="bi bi-truck me-2"></i>Delivery &amp;
                        return
                      </button>
                    </h3>
                    <div
                      id="policy6"
                      className="accordion-collapse collapse"
                      data-bs-parent="#policyAccordion"
                    >
                      <div className="accordion-body text-body-secondary">
                        Lalamove is used for both trips. I coordinate
                        delivery, while you arrange the return. Both fees
                        are paid by the renter.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-5 py-lg-6 bg-final-cta text-white">
          <div className="container py-lg-3">
            <div className="row g-5 align-items-center">
              <div className="col-lg-7">
                <p className="text-uppercase fw-semibold small text-primary-light ls-wide mb-2">
                  Planning a Game Night?
                </p>
                <h2 className="fs-1 mb-3">
                  Find the games that fit your dates.
                </h2>
                <p
                  className="lead text-white-50 mb-0"
                  style={{ maxWidth: "40rem" }}
                >
                  Choose your rental dates, see what&rsquo;s available, and
                  build your booking in just a few minutes.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="card border-0 shadow p-4 p-lg-5">
                  <h3 className="h4 mb-2">Ready to check?</h3>
                  <p className="text-body-secondary mb-4">
                    Pick your dates and I&rsquo;ll show you which games are
                    available.
                  </p>
                  <Link
                    href="/games"
                    className="btn btn-primary btn-lg rounded-pill w-100 mb-4"
                  >
                    Check Game Availability
                  </Link>
                  <hr />
                  <ul className="list-unstyled small text-body-secondary mb-0">
                    <li className="mb-2">Metro Manila only</li>
                    <li className="mb-2">GCash payment</li>
                    <li>Lalamove delivery &amp; return</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <RentalPoliciesModal />
      <ScrollToTopButton />
    </>
  );
}
