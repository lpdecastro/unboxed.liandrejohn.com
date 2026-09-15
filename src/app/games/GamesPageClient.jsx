"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RentalPoliciesModal from "@/components/RentalPoliciesModal";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import GameCard from "@/components/games/GameCard";
import { checkAvailability } from "@/app/actions/games";
import { createBooking } from "@/app/actions/bookings";
import { peso, formatDate } from "@/lib/format";
import { trackEvent } from "@/lib/analytics";
import { sendBookingNotificationEmail } from "@/lib/notifications";

// Code-split: GameDetailsModal is only needed once a game's details are
// opened, and AddressAutocomplete (which pulls in the Google Maps loader)
// only renders at the customer-details step (currentStep === 3) — neither
// needs to be in this page's initial JS bundle.
const GameDetailsModal = dynamic(
  () => import("@/components/games/GameDetailsModal")
);
const AddressAutocomplete = dynamic(
  () => import("@/components/games/AddressAutocomplete"),
  { ssr: false }
);

const MAX_RENTAL_DAYS = 7;

function addDaysISO(dateStr, days) {
  const ms = new Date(dateStr).getTime() + days * 24 * 60 * 60 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

function inclusiveDays(start, end) {
  return (
    Math.round((new Date(end) - new Date(start)) / (24 * 60 * 60 * 1000)) + 1
  );
}

function validateDates(start, end) {
  const today = new Date().toISOString().slice(0, 10);
  const startInvalid = !start || start < today;
  const endInvalid = !end || end < start;
  const rangeInvalid =
    !startInvalid &&
    !endInvalid &&
    Math.round((new Date(end) - new Date(start)) / (24 * 60 * 60 * 1000)) +
      1 >
      MAX_RENTAL_DAYS;
  return { startInvalid, endInvalid, rangeInvalid };
}

export default function GamesPageClient({ games, initialAddSlug }) {
  // Rental dates + availability
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [dateFormErrors, setDateFormErrors] = useState({
    startInvalid: false,
    endInvalid: false,
    rangeInvalid: false,
  });
  const [summaryDateError, setSummaryDateError] = useState(null);

  // Games + filter
  const [selectedSlugs, setSelectedSlugs] = useState(() => new Set());
  const [filter, setFilter] = useState("all");

  // Booking step flow
  const [currentStep, setCurrentStep] = useState(1);
  const [summaryStepError, setSummaryStepError] = useState(null);

  // GCash step
  const [gcashReference, setGcashReference] = useState("");
  const [gcashInvalid, setGcashInvalid] = useState(false);
  const [gcashError, setGcashError] = useState(null);

  // Customer details step
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [addressOutOfArea, setAddressOutOfArea] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation
  const [submitted, setSubmitted] = useState(null);

  // Game details modal
  const [activeModalSlug, setActiveModalSlug] = useState(null);

  const stickyRef = useRef(null);
  const gridRef = useRef(null);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);
  const offcanvasRef = useRef(null);
  const bootstrapRef = useRef(null);
  const mobileInputRef = useRef(null);
  const confirmationRef = useRef(null);

  // Load Bootstrap's JS once on the client and bind a Modal instance to the
  // game details modal so it can be opened programmatically once its
  // content has been set via React state. Also stash the bootstrap
  // namespace so the mobile booking offcanvas can be dismissed
  // programmatically when the booking step advances (see handleSummaryNext).
  // GameDetailsModal is now code-split (see the `dynamic()` import above),
  // so its ref may not be attached yet when this resolves — bootstrapRef is
  // stashed unconditionally, and the Modal instance itself is created here
  // if possible, falling back to a lazy create-on-first-open in
  // openGameDetails below if the modal hadn't mounted yet.
  useEffect(() => {
    let cancelled = false;
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((mod) => {
      if (cancelled) return;
      const bootstrapNs = mod.default ?? mod;
      bootstrapRef.current = bootstrapNs;
      if (modalRef.current && !modalInstanceRef.current) {
        modalInstanceRef.current = new bootstrapNs.Modal(modalRef.current);
      }
    });
    return () => {
      cancelled = true;
      modalInstanceRef.current?.dispose();
      modalInstanceRef.current = null;
    };
  }, []);

  // Keep the sticky checkout sidebar positioned below the sticky header.
  useEffect(() => {
    const header = document.getElementById("siteHeader");
    const sticky = stickyRef.current;
    if (!header || !sticky) return undefined;

    function updateOffset() {
      sticky.style.top = header.offsetHeight + 24 + "px";
    }

    updateOffset();
    window.addEventListener("resize", updateOffset);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateOffset);
      resizeObserver.observe(header);
    }

    return () => {
      window.removeEventListener("resize", updateOffset);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (submitted) {
      confirmationRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [submitted]);

  // Coming from a homepage "Add to Booking" link (?add={slug}): default the
  // rental dates to today, check availability, and add that game to the
  // booking regardless of the result. Runs once on mount only.
  useEffect(() => {
    if (!initialAddSlug) return;
    const game = games.find((g) => g.slug === initialAddSlug);
    if (!game) return;

    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(today);
    setSelectedSlugs((prev) => new Set(prev).add(game.slug));
    toast(`${game.name} added to your booking.`, {
      toastId: game.slug,
      icon: <i className="bi bi-check-circle text-success"></i>,
    });
    trackEvent("quick_add_from_url", { game_slug: game.slug });

    let cancelled = false;
    recheckWithDates(today, today).then(() => {
      if (cancelled || !stickyRef.current) return;
      const headerHeight = document.getElementById("siteHeader")?.offsetHeight ?? 0;
      // On mobile the booking box sits above the grid; on desktop they sit
      // side by side in the same row. Anchor on whichever is closer to the
      // top of the page so the other one can't end up scrolled past it and
      // tucked under the sticky header.
      const stickyTop = stickyRef.current.getBoundingClientRect().top;
      const gridTop = gridRef.current?.getBoundingClientRect().top;
      const anchorTop = gridTop == null ? stickyTop : Math.min(stickyTop, gridTop);
      const top = window.scrollY + anchorTop - headerHeight - 16;
      window.scrollTo({ top, behavior: "smooth" });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const datesAreValid =
    Boolean(startDate) &&
    Boolean(endDate) &&
    !validateDates(startDate, endDate).startInvalid &&
    !validateDates(startDate, endDate).endInvalid &&
    !validateDates(startDate, endDate).rangeInvalid;
  const effectivelyChecked = availabilityChecked && datesAreValid;

  const todayISO = new Date().toISOString().slice(0, 10);
  const minEndDate = startDate || todayISO;
  const maxEndDate = startDate
    ? addDaysISO(startDate, MAX_RENTAL_DAYS - 1)
    : undefined;

  const rentalDays = effectivelyChecked
    ? Math.round(
        (new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000)
      ) + 1
    : 0;

  const cardStatus = useMemo(() => {
    const statuses = {};
    games.forEach((game) => {
      statuses[game.slug] = !effectivelyChecked
        ? "unknown"
        : availabilityMap[game.slug]
        ? "available"
        : "unavailable";
    });
    return statuses;
  }, [effectivelyChecked, availabilityMap, games]);

  const selectedGames = games.filter((g) => selectedSlugs.has(g.slug));
  const hasUnavailableSelected = selectedGames.some(
    (g) => cardStatus[g.slug] === "unavailable"
  );

  const subtotal = selectedGames.reduce(
    (sum, g) => sum + g.pricePerDay * rentalDays,
    0
  );
  const depositTotal = selectedGames.reduce((sum, g) => sum + g.deposit, 0);
  const discount = selectedGames.length >= 2 ? subtotal * 0.1 : 0;
  const grandTotal = subtotal - discount + depositTotal;

  const visibleGames =
    filter === "available" || filter === "unavailable"
      ? games.filter((g) => cardStatus[g.slug] === filter)
      : games;

  function toggleGame(slug) {
    const isAdding = !selectedSlugs.has(slug);
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
    const game = games.find((g) => g.slug === slug);
    if (isAdding) {
      if (game) {
        toast(`${game.name} added to your booking.`, {
          toastId: slug,
          icon: <i className="bi bi-check-circle text-success"></i>,
        });
      }
      trackEvent("add_to_booking", {
        game_slug: slug,
        game_name: game?.name,
        price_per_day: game?.pricePerDay,
      });
    } else {
      trackEvent("remove_from_booking", {
        game_slug: slug,
        game_name: game?.name,
      });
    }
  }

  function openGameDetails(slug) {
    setActiveModalSlug(slug);
    if (!modalInstanceRef.current && bootstrapRef.current && modalRef.current) {
      modalInstanceRef.current = new bootstrapRef.current.Modal(modalRef.current);
    }
    modalInstanceRef.current?.show();
    const game = games.find((g) => g.slug === slug);
    trackEvent("view_game_details", {
      game_slug: slug,
      game_name: game?.name,
    });
  }

  async function recheckWithDates(start, end) {
    const v = validateDates(start, end);
    setDateFormErrors(v);
    if (v.startInvalid || v.endInvalid || v.rangeInvalid) {
      setSummaryDateError(
        v.rangeInvalid
          ? `Rentals are limited to ${MAX_RENTAL_DAYS} days.`
          : "Please choose a valid rental date range."
      );
      return;
    }
    setSummaryDateError(null);
    setIsCheckingAvailability(true);
    const result = await checkAvailability(start, end);
    setAvailabilityMap(result);
    setAvailabilityChecked(true);
    setIsCheckingAvailability(false);
    trackEvent("check_availability", {
      start_date: start,
      end_date: end,
      rental_days: inclusiveDays(start, end),
    });
  }

  function handleStartDateChange(e) {
    const value = e.target.value;
    setStartDate(value);
    if (availabilityChecked) recheckWithDates(value, endDate);
  }

  function handleEndDateChange(e) {
    const value = e.target.value;
    setEndDate(value);
    if (availabilityChecked) recheckWithDates(startDate, value);
  }

  async function handleDateFormSubmit(e) {
    e.preventDefault();
    const v = validateDates(startDate, endDate);
    setDateFormErrors(v);
    if (v.startInvalid || v.endInvalid || v.rangeInvalid) return;
    setSummaryDateError(null);
    setIsCheckingAvailability(true);
    const result = await checkAvailability(startDate, endDate);
    setAvailabilityMap(result);
    setAvailabilityChecked(true);
    setIsCheckingAvailability(false);
    trackEvent("check_availability", {
      start_date: startDate,
      end_date: endDate,
      rental_days: inclusiveDays(startDate, endDate),
    });
  }

  async function handleSummaryNext() {
    if (!effectivelyChecked) {
      const v = validateDates(startDate, endDate);
      setDateFormErrors(v);
      if (v.startInvalid || v.endInvalid || v.rangeInvalid) {
        setSummaryDateError(
          v.rangeInvalid
            ? `Rentals are limited to ${MAX_RENTAL_DAYS} days.`
            : "Please choose a valid rental date range."
        );
        return;
      }
      setSummaryDateError(null);
      setIsCheckingAvailability(true);
      const result = await checkAvailability(startDate, endDate);
      setAvailabilityMap(result);
      setAvailabilityChecked(true);
      setIsCheckingAvailability(false);
      trackEvent("check_availability", {
        start_date: startDate,
        end_date: endDate,
        rental_days: inclusiveDays(startDate, endDate),
      });
      return;
    }

    const errors = [];
    if (selectedSlugs.size === 0) {
      errors.push("Add at least one game to your booking.");
    }
    if (hasUnavailableSelected) {
      errors.push(
        "Remove unavailable games or choose different dates to continue."
      );
    }

    if (errors.length > 0) {
      setSummaryStepError(errors.join(" "));
      return;
    }

    setSummaryStepError(null);
    // Dismiss the mobile offcanvas if it's open — advancing to step 2 hides
    // the "View Booking" trigger, and calling hide() here (rather than
    // letting the offcanvas get yanked out from under an in-progress
    // Bootstrap transition) is what keeps its backdrop from getting stuck.
    const wasInOffcanvas = Boolean(
      offcanvasRef.current?.classList.contains("show")
    );
    if (offcanvasRef.current) {
      bootstrapRef.current?.Offcanvas.getInstance(offcanvasRef.current)?.hide();
    }
    trackEvent("booking_summary_next", {
      num_games: selectedGames.length,
      grand_total: grandTotal,
    });
    setCurrentStep(2);
    // The user tapped Next from inside the offcanvas, which could be
    // anywhere down the game grid — scroll back up to the "Pay with GCash"
    // box (the same sticky container, now on step 2) so it's in view.
    if (wasInOffcanvas && stickyRef.current) {
      const headerHeight =
        document.getElementById("siteHeader")?.offsetHeight ?? 0;
      const top =
        window.scrollY +
        stickyRef.current.getBoundingClientRect().top -
        headerHeight -
        16;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function handleGcashNext() {
    const ref = gcashReference.trim();
    if (!/^\d{6}$/.test(ref)) {
      setGcashInvalid(true);
      setGcashError("Please enter the last 6 digits of your GCash reference number.");
      return;
    }
    setGcashInvalid(false);
    setGcashError(null);
    trackEvent("gcash_step_next", { grand_total: grandTotal });
    setCurrentStep(3);
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    const errors = [];
    if (selectedSlugs.size === 0) {
      errors.push("Add at least one game to your booking.");
    }
    if (!effectivelyChecked) {
      errors.push("Check availability for your rental dates first.");
    }
    if (addressOutOfArea) {
      errors.push(
        "Please select a delivery address from the suggestions to confirm it's within Metro Manila."
      );
    }

    const mobileValid =
      !customerMobile ||
      /^(09|\+639)\d{9}$/.test(customerMobile.replace(/[\s-]/g, ""));
    mobileInputRef.current?.setCustomValidity(mobileValid ? "" : "invalid");

    setFormValidated(true);
    const formValid = e.target.checkValidity();

    if (!formValid || errors.length > 0) {
      setFormError(
        errors.length > 0
          ? errors.join(" ")
          : "Please check the highlighted fields before submitting."
      );
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    trackEvent("submit_booking_attempt", {
      num_games: selectedSlugs.size,
      rental_days: rentalDays,
      grand_total: grandTotal,
    });

    const result = await createBooking({
      slugs: Array.from(selectedSlugs),
      startDate,
      endDate,
      customer: {
        name: customerName,
        mobile: customerMobile,
        address: customerAddress,
      },
      gcashReferenceNumber: gcashReference,
    });

    if (!result.success) {
      trackEvent("booking_error", { error_message: result.error });
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    trackEvent("booking_success", {
      booking_number: result.bookingNumber,
      grand_total: grandTotal,
      num_games: selectedGames.length,
    });

    setSubmitted({
      bookingNumber: result.bookingNumber,
      gamesText: result.gamesText,
      datesText: result.datesText,
      amountText: result.amountText,
      addressText: result.addressText,
    });
    setIsSubmitting(false);

    sendBookingNotificationEmail({
      bookingNumber: result.bookingNumber,
      customerName: customerName.trim(),
      customerMobile,
      customerAddress: result.addressText,
      gamesText: result.gamesText,
      datesText: result.datesText,
      amountText: result.amountText,
      gcashReferenceNumber: gcashReference.trim(),
    });
  }

  const activeGame = games.find((g) => g.slug === activeModalSlug) ?? null;
  const isBuildingBooking = currentStep === 1;
  const hasGames = selectedSlugs.size > 0;

  // Shared step-1 summary body (rental dates, selected games, pricing,
  // Next/Check Availability) rendered by both the desktop sticky sidebar
  // and the mobile offcanvas, so the id prefix avoids duplicate DOM ids.
  function renderBookingSummaryBody(idPrefix) {
    return (
      <>
        {!hasGames && (
          <div className="text-center py-4">
            <i className="bi bi-cart3 fs-1 text-body-secondary d-block mb-3"></i>
            <p className="fw-semibold mb-1">No games added yet</p>
            <p className="small text-body-secondary mb-0">
              Choose your dates and add at least one game to start your
              booking.
            </p>
          </div>
        )}

        {hasGames && (
          <div>
            <p className="small fw-semibold mb-2">
              Rental Dates{" "}
              <span className="fw-normal text-body-secondary">
                (max {MAX_RENTAL_DAYS} days)
              </span>
            </p>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label
                  htmlFor={`${idPrefix}StartDate`}
                  className="visually-hidden"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  className={`form-control${
                    summaryDateError ? " is-invalid" : ""
                  }`}
                  id={`${idPrefix}StartDate`}
                  aria-label="Start Date"
                  required
                  min={todayISO}
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <div className="invalid-feedback">
                  Start date can&rsquo;t be in the past.
                </div>
              </div>
              <div className="col-6">
                <label
                  htmlFor={`${idPrefix}EndDate`}
                  className="visually-hidden"
                >
                  End Date
                </label>
                <input
                  type="date"
                  className={`form-control${
                    summaryDateError ? " is-invalid" : ""
                  }`}
                  id={`${idPrefix}EndDate`}
                  aria-label="End Date"
                  required
                  min={minEndDate}
                  max={maxEndDate}
                  value={endDate}
                  onChange={handleEndDateChange}
                />
                <div className="invalid-feedback">
                  End date must be on or after the start date.
                </div>
              </div>
            </div>
            {summaryDateError && (
              <div className="alert alert-danger small mb-3" role="alert">
                {summaryDateError}
              </div>
            )}
            <ul className="list-unstyled mb-3">
              {selectedGames.map((g) => {
                const isUnavailable = cardStatus[g.slug] === "unavailable";
                return (
                  <li
                    key={g.slug}
                    className="d-flex justify-content-between align-items-start mb-2"
                  >
                    <span>
                      <span className="d-block fw-semibold small">
                        {g.name}
                        {isUnavailable && (
                          <span className="badge bg-danger-subtle text-danger-emphasis rounded-pill ms-1">
                            Unavailable
                          </span>
                        )}
                      </span>
                      {effectivelyChecked && (
                        <span className="d-block text-body-secondary small">
                          {peso(g.pricePerDay)} &times; {rentalDays}
                          {rentalDays === 1 ? " day" : " days"}
                        </span>
                      )}
                    </span>
                    <span className="d-flex align-items-center gap-2">
                      {effectivelyChecked && (
                        <span className="small fw-semibold">
                          {peso(g.pricePerDay * rentalDays)}
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => toggleGame(g.slug)}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
            {effectivelyChecked && (
              <div>
                <hr />
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-body-secondary">Rental Subtotal</span>
                  <span>{peso(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between small mb-2">
                    <span className="text-body-secondary">
                      Multi-Game Discount
                    </span>
                    <span>&minus;{peso(discount)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small mb-3">
                  <span className="text-body-secondary">
                    Refundable Deposits
                  </span>
                  <span>{peso(depositTotal)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-semibold">Amount to Pay</span>
                  <span className="fs-4 fw-bold">{peso(grandTotal)}</span>
                </div>
              </div>
            )}
            {summaryStepError && (
              <div className="alert alert-danger small mb-3" role="alert">
                {summaryStepError}
              </div>
            )}
            <div className="d-grid">
              <button
                type="button"
                className="btn btn-primary rounded-pill fw-semibold"
                disabled={
                  isCheckingAvailability ||
                  (effectivelyChecked && hasUnavailableSelected)
                }
                onClick={handleSummaryNext}
              >
                {effectivelyChecked ? (
                  "Next"
                ) : isCheckingAvailability ? (
                  "Checking…"
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>
                    Check Availability
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Navbar active="games" id="siteHeader" />

      <main className="flex-grow-1">
        {!submitted && (
          <section className="py-4 py-lg-5">
            <div className="container">
              <h1 className="visually-hidden">Choose Your Games</h1>

              {/* Rental Date Selector */}
              <div className="card border shadow-sm p-3 p-lg-4 mb-5">
                <h2 className="h4 mb-1">When do you need the games?</h2>
                <p className="small text-body-secondary mb-4">
                  Metro Manila only <span className="mx-1">&bull;</span>{" "}
                  Refundable deposits
                  <span className="mx-1">&bull;</span> Delivery and return
                  via Lalamove
                </p>
                <form
                  className="row g-3 align-items-start"
                  noValidate
                  onSubmit={handleDateFormSubmit}
                >
                  <div className="col-sm-6 col-lg-3">
                    <label htmlFor="startDate" className="form-label fw-semibold">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className={`form-control${
                        dateFormErrors.startInvalid ? " is-invalid" : ""
                      }`}
                      id="startDate"
                      required
                      min={todayISO}
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                    <div className="invalid-feedback">
                      Start date can&rsquo;t be in the past.
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <label htmlFor="endDate" className="form-label fw-semibold">
                      End Date{" "}
                      <span className="fw-normal text-body-secondary">
                        (max {MAX_RENTAL_DAYS} days)
                      </span>
                    </label>
                    <input
                      type="date"
                      className={`form-control${
                        !dateFormErrors.startInvalid &&
                        (dateFormErrors.endInvalid || dateFormErrors.rangeInvalid)
                          ? " is-invalid"
                          : ""
                      }`}
                      id="endDate"
                      required
                      min={minEndDate}
                      max={maxEndDate}
                      value={endDate}
                      onChange={handleEndDateChange}
                    />
                    <div className="invalid-feedback">
                      {dateFormErrors.rangeInvalid
                        ? `Rentals are limited to ${MAX_RENTAL_DAYS} days — choose an end date within a week of the start date.`
                        : "End date must be on or after the start date."}
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <label htmlFor="gameFilterSelect" className="form-label fw-semibold">
                      Show
                    </label>
                    <select
                      className="form-select"
                      id="gameFilterSelect"
                      value={filter}
                      onChange={(e) => {
                        setFilter(e.target.value);
                        trackEvent("apply_filter", { filter: e.target.value });
                      }}
                    >
                      <option value="all">All Games</option>
                      <option value="available" disabled={!effectivelyChecked}>
                        Available Only
                      </option>
                      <option value="unavailable" disabled={!effectivelyChecked}>
                        Booked Only
                      </option>
                    </select>
                  </div>
                  <div className="col-sm-6 col-lg-3 d-grid d-lg-block">
                    <label className="form-label d-none d-lg-block">&nbsp;</label>
                    <button
                      type="submit"
                      className="btn btn-primary fw-semibold rounded-pill px-4"
                      disabled={isCheckingAvailability}
                    >
                      <i className="bi bi-search me-2"></i>
                      {isCheckingAvailability
                        ? "Checking…"
                        : "Check Availability"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="row g-4">
                {/* Game Filters + Grid */}
                <div className={`col-lg-8${isBuildingBooking ? "" : " d-none"}`}>
                  <div
                    ref={gridRef}
                    className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4"
                  >
                    {visibleGames.map((game) => (
                      <GameCard
                        key={game.slug}
                        game={game}
                        status={cardStatus[game.slug]}
                        isSelected={selectedSlugs.has(game.slug)}
                        onToggle={() => toggleGame(game.slug)}
                        onViewDetails={() => openGameDetails(game.slug)}
                      />
                    ))}
                  </div>

                  {visibleGames.length === 0 && (
                    <div className="text-center text-body-secondary py-5">
                      <i className="bi bi-emoji-frown fs-1 d-block mb-3"></i>
                      No available games match your filter right now.
                    </div>
                  )}
                </div>

                {/* Read-Only Booking Summary (replaces the grid once payment/details are in progress) */}
                {!isBuildingBooking && (
                  <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 p-lg-5">
                      <h2 className="h4 mb-4">Booking Summary</h2>
                      <div className="d-flex justify-content-between small mb-3 pb-3 border-bottom">
                        <span className="text-body-secondary">Rental Dates</span>
                        <span className="fw-semibold">
                          {formatDate(startDate)} &ndash; {formatDate(endDate)} (
                          {rentalDays}
                          {rentalDays === 1 ? " day" : " days"})
                        </span>
                      </div>
                      <ul className="list-unstyled mb-3">
                        {selectedGames.map((g) => (
                          <li
                            key={g.slug}
                            className="d-flex justify-content-between align-items-start mb-2"
                          >
                            <span>
                              <span className="d-block fw-semibold small">
                                {g.name}
                              </span>
                              <span className="d-block text-body-secondary small">
                                {peso(g.pricePerDay)} &times; {rentalDays}
                                {rentalDays === 1 ? " day" : " days"}
                              </span>
                            </span>
                            <span className="small fw-semibold">
                              {peso(g.pricePerDay * rentalDays)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <hr />
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-body-secondary">Rental Subtotal</span>
                        <span>{peso(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="d-flex justify-content-between small mb-2">
                          <span className="text-body-secondary">
                            Multi-Game Discount
                          </span>
                          <span>&minus;{peso(discount)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between small mb-3">
                        <span className="text-body-secondary">
                          Refundable Deposits
                        </span>
                        <span>{peso(depositTotal)}</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-semibold">Amount to Pay</span>
                        <span className="fs-3 fw-bold">{peso(grandTotal)}</span>
                      </div>
                      <div className="d-flex justify-content-between small pt-3 border-top">
                        <span className="text-body-secondary">GCash Ref</span>
                        <span>{gcashReference || "—"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sticky Checkout Sidebar */}
                <div className="col-lg-4 order-first order-lg-last">
                  <form
                    className={`h-100${formValidated ? " was-validated" : ""}`}
                    noValidate
                    onSubmit={handleBookingSubmit}
                  >
                    <div
                      className="sticky-top d-flex flex-column gap-4"
                      ref={stickyRef}
                    >
                      {/* Booking Summary (desktop sidebar; mobile uses the
                          fixed bottom bar + offcanvas below instead) */}
                      {currentStep === 1 && (
                        <div className="card border-0 shadow-sm p-4 d-none d-lg-block">
                          <h2 className="h5 mb-3">Your Booking</h2>
                          {renderBookingSummaryBody("summaryEdit")}
                        </div>
                      )}

                      {/* GCash Payment */}
                      {currentStep === 2 && (
                        <div className="card border-0 shadow-sm p-4">
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <button
                              type="button"
                              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 p-0"
                              style={{ width: "2.5rem", height: "2.5rem" }}
                              aria-label="Back to booking summary"
                              onClick={() => setCurrentStep(1)}
                            >
                              <i className="bi bi-arrow-left"></i>
                            </button>
                            <div>
                              <h2 className="h5 mb-1">Pay with GCash</h2>
                              <p className="small text-body-secondary mb-0">
                                Send the Amount to Pay shown in your Booking
                                Summary before submitting.
                              </p>
                            </div>
                          </div>
                          <div className="border rounded-3 d-flex flex-column align-items-center justify-content-center text-center p-4 mb-3 bg-body-tertiary">
                            <Image
                              src="/img/gcash-qr.webp"
                              alt="GCash QR code"
                              width={220}
                              height={220}
                              className="mb-2"
                            />
                            <p className="small text-body-secondary mb-0">
                              Scan to Pay
                            </p>
                          </div>
                          <ol className="small text-body-secondary ps-3 mb-3">
                            <li>Open GCash and scan the QR code.</li>
                            <li>
                              Send exactly the Amount to Pay shown in your
                              Booking Summary.
                            </li>
                            <li>
                              Copy the last 6 digits of the GCash reference
                              number after your payment goes through.
                            </li>
                          </ol>
                          <div className="mb-2">
                            <label htmlFor="gcashReference" className="form-label fw-semibold">
                              GCash Reference Number (last 6 digits)
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              className={`form-control${gcashInvalid ? " is-invalid" : ""}`}
                              id="gcashReference"
                              placeholder="e.g. 123456"
                              maxLength={6}
                              required
                              value={gcashReference}
                              onChange={(e) => {
                                setGcashReference(e.target.value.replace(/\D/g, "").slice(0, 6));
                                setGcashInvalid(false);
                              }}
                            />
                            <div className="invalid-feedback">
                              Please enter the last 6 digits of your GCash reference number.
                            </div>
                          </div>
                          <p className="small text-body-secondary mb-3">
                            <i className="bi bi-info-circle me-1"></i>Your
                            booking is not confirmed yet. I&rsquo;ll manually
                            verify your GCash payment after you submit.
                          </p>
                          {gcashError && (
                            <div className="alert alert-danger small mb-3" role="alert">
                              {gcashError}
                            </div>
                          )}
                          <div className="d-grid">
                            <button
                              type="button"
                              className="btn btn-primary rounded-pill fw-semibold"
                              onClick={handleGcashNext}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Customer Details */}
                      {currentStep === 3 && (
                        <div className="card border-0 shadow-sm p-4">
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <button
                              type="button"
                              className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 p-0"
                              style={{ width: "2.5rem", height: "2.5rem" }}
                              aria-label="Back to GCash payment"
                              onClick={() => setCurrentStep(2)}
                            >
                              <i className="bi bi-arrow-left"></i>
                            </button>
                            <div>
                              <h2 className="h5 mb-1">Your Details</h2>
                              <p className="small text-body-secondary mb-0">
                                I&rsquo;ll use these details to confirm your
                                booking and coordinate delivery.
                              </p>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="customerName" className="form-label fw-semibold">
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="customerName"
                              placeholder="Juan Dela Cruz"
                              required
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                            />
                            <div className="invalid-feedback">
                              Please enter your full name.
                            </div>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="customerMobile" className="form-label fw-semibold">
                              Mobile Number
                            </label>
                            <input
                              type="tel"
                              className="form-control"
                              id="customerMobile"
                              placeholder="09XX XXX XXXX"
                              required
                              ref={mobileInputRef}
                              value={customerMobile}
                              onChange={(e) => {
                                setCustomerMobile(e.target.value);
                                mobileInputRef.current?.setCustomValidity("");
                              }}
                            />
                            <div className="invalid-feedback">
                              Enter a valid Philippine mobile number.
                            </div>
                          </div>
                          <AddressAutocomplete
                            id="customerAddress"
                            value={customerAddress}
                            onChange={setCustomerAddress}
                            onOutOfArea={setAddressOutOfArea}
                            required
                          />
                          <p className="small text-body-secondary mb-3">
                            Rentals are available within Metro Manila only.
                            Lalamove fees are paid directly to the rider.
                          </p>

                          <p className="small text-body-secondary mb-3">
                            By submitting, you confirm you understand the{" "}
                            <a
                              href="#rentalPoliciesModal"
                              data-bs-toggle="modal"
                              className="link-primary fw-semibold"
                              onClick={() =>
                                trackEvent("open_rental_policies", {
                                  location: "games_page",
                                })
                              }
                            >
                              rental policies
                            </a>
                            , including cancellation, refundable deposits,
                            late fees, and Lalamove responsibilities.
                          </p>

                          {formError && (
                            <div className="alert alert-danger small mb-3" role="alert">
                              {formError}
                            </div>
                          )}

                          <div className="d-grid">
                            <button
                              type="submit"
                              className="btn btn-primary fw-semibold rounded-pill"
                              disabled={isSubmitting || addressOutOfArea}
                            >
                              {isSubmitting
                                ? "Submitting Booking…"
                                : "Submit Booking"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Reserve space below the grid so the mobile bottom bar never
                  overlaps the last row of game cards. */}
              {currentStep === 1 && hasGames && (
                <div className="d-lg-none" style={{ height: "6rem" }} aria-hidden="true"></div>
              )}
            </div>
          </section>
        )}

        {/* Mobile Booking Bottom Bar (step 1 only) */}
        {!submitted && currentStep === 1 && hasGames && (
          <div className="fixed-bottom d-lg-none bg-dark text-white shadow p-3 d-flex align-items-center justify-content-between">
            <span>
              <span className="fw-semibold">
                {selectedGames.length}{" "}
                {selectedGames.length === 1 ? "game" : "games"}
              </span>
              {effectivelyChecked && (
                <span className="text-white-50">
                  {" "}
                  &middot; {peso(grandTotal)}
                </span>
              )}
            </span>
            <button
              type="button"
              className="btn btn-light rounded-pill fw-semibold"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileBookingOffcanvas"
              aria-controls="mobileBookingOffcanvas"
              onClick={() => trackEvent("mobile_booking_summary_open")}
            >
              View Booking
              <i className="bi bi-chevron-up ms-2"></i>
            </button>
          </div>
        )}

        {/* Mobile Booking Offcanvas. Stays mounted (off-screen, closed) for
            as long as games are selected rather than unmounting the instant
            the user leaves step 1 — the "Next" button inside dismisses it
            via handleSummaryNext, and letting Bootstrap's own hide
            transition run against a still-attached node is what keeps the
            offcanvas backdrop/body classes from getting stuck. */}
        {!submitted && hasGames && (
          <div
            ref={offcanvasRef}
            className="offcanvas offcanvas-bottom d-lg-none"
            tabIndex={-1}
            id="mobileBookingOffcanvas"
            aria-labelledby="mobileBookingOffcanvasLabel"
            style={{ "--bs-offcanvas-height": "85vh" }}
          >
            <div className="offcanvas-header">
              <h2 className="offcanvas-title h5" id="mobileBookingOffcanvasLabel">
                Your Booking
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              {renderBookingSummaryBody("mobileSummaryEdit")}
            </div>
          </div>
        )}

        {/* Booking Confirmation State */}
        {submitted && (
          <section className="py-5 py-lg-6" ref={confirmationRef}>
            <div className="container" style={{ maxWidth: "40rem" }}>
              <div className="card border-0 shadow-sm p-4 p-lg-5">
                <p className="text-uppercase text-primary fw-semibold small ls-wide mb-2">
                  Booking Received
                </p>
                <h2 className="fs-2 fw-bold mb-3">
                  Thanks! I&rsquo;ve received your booking.
                </h2>
                <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                  <span className="fs-5 fw-bold">{submitted.bookingNumber}</span>
                  <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-2">
                    Pending Payment Verification
                  </span>
                </div>
                <p className="text-body-secondary mb-4">
                  I&rsquo;ll check your GCash payment and booking details.
                  I&rsquo;ll text you once everything is confirmed.
                </p>

                <div className="bg-body-tertiary rounded-3 p-4 mb-4">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <p className="small text-body-secondary mb-1">Games</p>
                      <p className="fw-semibold mb-0">{submitted.gamesText}</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="small text-body-secondary mb-1">Rental Dates</p>
                      <p className="fw-semibold mb-0">{submitted.datesText}</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="small text-body-secondary mb-1">Amount Sent</p>
                      <p className="fw-semibold mb-0">{submitted.amountText}</p>
                    </div>
                    <div className="col-sm-6">
                      <p className="small text-body-secondary mb-1">
                        Delivery Address
                      </p>
                      <p className="fw-semibold mb-0">{submitted.addressText}</p>
                    </div>
                  </div>
                </div>

                <h3 className="h6 fw-semibold mb-3">What Happens Next</h3>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex gap-3 mb-3">
                    <span
                      className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-primary text-white fw-bold"
                      style={{ width: "1.75rem", height: "1.75rem", fontSize: "0.85rem" }}
                    >
                      1
                    </span>
                    <span className="text-body-secondary">
                      I verify your GCash payment and game availability.
                    </span>
                  </li>
                  <li className="d-flex gap-3 mb-3">
                    <span
                      className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-primary text-white fw-bold"
                      style={{ width: "1.75rem", height: "1.75rem", fontSize: "0.85rem" }}
                    >
                      2
                    </span>
                    <span className="text-body-secondary">
                      I text you once your booking is confirmed.
                    </span>
                  </li>
                  <li className="d-flex gap-3">
                    <span
                      className="d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle bg-primary text-white fw-bold"
                      style={{ width: "1.75rem", height: "1.75rem", fontSize: "0.85rem" }}
                    >
                      3
                    </span>
                    <span className="text-body-secondary">
                      I coordinate the Lalamove delivery with you before your
                      rental starts.
                    </span>
                  </li>
                </ul>

                <p className="small text-body-secondary mb-2">
                  <i className="bi bi-truck me-1"></i>You&rsquo;ll pay the
                  Lalamove delivery fee. On your return date, you&rsquo;ll
                  also arrange and pay for the Lalamove return.
                </p>
                <p className="small text-body-secondary mb-4">
                  <i className="bi bi-shield-check me-1"></i>Your security
                  deposit will be refunded after the games are returned and
                  inspected.
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4"
                    onClick={() => window.location.reload()}
                  >
                    Back to Games
                  </button>
                  <a
                    href="/"
                    className="btn btn-outline-primary rounded-pill px-4"
                    onClick={() =>
                      trackEvent("cta_click", {
                        label: "Back to Home",
                        location: "booking_confirmation",
                      })
                    }
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      <GameDetailsModal
        ref={modalRef}
        game={activeGame}
        isSelected={activeModalSlug ? selectedSlugs.has(activeModalSlug) : false}
        onToggle={() => activeModalSlug && toggleGame(activeModalSlug)}
      />
      <RentalPoliciesModal />
      <ToastContainer position="top-center" autoClose={3000} theme="light" />
      <ScrollToTopButton raised={!submitted && currentStep === 1 && hasGames} />
    </>
  );
}
