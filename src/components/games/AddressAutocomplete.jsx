"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let mapsOptionsConfigured = false;

const METRO_MANILA_BOUNDS = {
  south: 14.35,
  west: 120.9,
  north: 14.76,
  east: 121.13,
};

const NCR_CITIES = [
  "caloocan",
  "las pinas",
  "makati",
  "malabon",
  "mandaluyong",
  "manila",
  "marikina",
  "muntinlupa",
  "navotas",
  "paranaque",
  "pasay",
  "pasig",
  "quezon city",
  "san juan",
  "taguig",
  "valenzuela",
  "pateros",
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// `place` here is a Places API (New) `Place` instance, whose address
// components use `longText`/`types` rather than the legacy `long_name`.
function isMetroManilaPlace(place) {
  const components = place.addressComponents ?? [];
  return components.some((component) => {
    const name = normalize(component.longText ?? "");
    if (component.types.includes("administrative_area_level_1")) {
      return (
        name.includes("metro manila") || name.includes("national capital region")
      );
    }
    if (
      component.types.includes("locality") ||
      component.types.includes("administrative_area_level_2")
    ) {
      return NCR_CITIES.includes(name);
    }
    return false;
  });
}

export default function AddressAutocomplete({ value, onChange, id, required, onOutOfArea }) {
  const containerRef = useRef(null);
  const elementRef = useRef(null);
  const mapDivRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onOutOfAreaRef = useRef(onOutOfArea);
  onOutOfAreaRef.current = onOutOfArea;
  const lastSelectedValueRef = useRef(null);

  const [available, setAvailable] = useState(
    () => typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
  );
  const [placeSelected, setPlaceSelected] = useState(false);
  const [outsideMetroManila, setOutsideMetroManila] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !containerRef.current) return;

    let cancelled = false;
    if (!mapsOptionsConfigured) {
      setOptions({ key: apiKey, v: "weekly" });
      mapsOptionsConfigured = true;
    }

    Promise.all([importLibrary("places"), importLibrary("maps")])
      .then(([placesLib]) => {
        if (cancelled || !containerRef.current) return;

        const element = new placesLib.PlaceAutocompleteElement({
          includedRegionCodes: ["ph"],
          locationBias: METRO_MANILA_BOUNDS,
        });
        element.id = id;
        element.className = "form-control";
        if (required) element.setAttribute("required", "");
        try {
          element.setAttribute("placeholder", "House/unit, street, barangay, city, Metro Manila");
        } catch {
          // Placeholder pass-through isn't guaranteed on every version; safe to skip.
        }
        if (value) element.value = value;

        elementRef.current = element;
        containerRef.current.appendChild(element);

        // Manual typing without picking a suggestion: sync on blur, same as
        // the plain-input fallback below. If the text no longer matches the
        // last confirmed selection, we can't know whether it's in Metro
        // Manila — block submission until they pick a suggestion instead of
        // trusting unverified free text.
        element.addEventListener("focusout", () => {
          const text = element.value ?? "";
          onChangeRef.current(text);
          if (text !== lastSelectedValueRef.current) {
            lastSelectedValueRef.current = null;
            setPlaceSelected(false);
            setOutsideMetroManila(false);
            const needsSelection = text.trim().length > 0;
            setUnconfirmed(needsSelection);
            onOutOfAreaRef.current?.(needsSelection);
          }
        });

        element.addEventListener("gmp-select", async (event) => {
          const prediction = event.placePrediction;
          if (!prediction) return;

          const place = prediction.toPlace();
          await place.fetchFields({
            fields: ["formattedAddress", "addressComponents", "location"],
          });

          const formatted = place.formattedAddress ?? element.value ?? "";
          element.value = formatted;
          lastSelectedValueRef.current = formatted;
          onChangeRef.current(formatted);
          setUnconfirmed(false);

          const isOutOfArea = !isMetroManilaPlace(place);
          setOutsideMetroManila(isOutOfArea);
          setPlaceSelected(true);
          onOutOfAreaRef.current?.(isOutOfArea);

          if (!place.location) return;
          const coords = {
            lat: place.location.lat(),
            lng: place.location.lng(),
          };

          if (!mapInstanceRef.current && mapDivRef.current) {
            mapInstanceRef.current = new google.maps.Map(mapDivRef.current, {
              center: coords,
              zoom: 16,
              disableDefaultUI: true,
              zoomControl: true,
            });
            markerRef.current = new google.maps.Marker({
              position: coords,
              map: mapInstanceRef.current,
              draggable: false,
            });
          } else if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(coords);
            markerRef.current?.setPosition(coords);
          }
        });
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });

    return () => {
      cancelled = true;
      elementRef.current?.remove();
      onOutOfAreaRef.current?.(false);
    };
  }, []);

  if (!available) {
    return (
      <div className="mb-3">
        <label htmlFor={id} className="form-label fw-semibold">
          Complete Delivery Address
        </label>
        <textarea
          className="form-control"
          id={id}
          rows={2}
          placeholder="House/unit, street, barangay, city, Metro Manila"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
        <div className="invalid-feedback">
          Please enter a complete Metro Manila delivery address.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <style>{`
        gmp-place-autocomplete::part(input) {
          font: inherit;
          padding: 0.375rem 0.75rem;
        }
      `}</style>
      <label htmlFor={id} className="form-label fw-semibold">
        Complete Delivery Address
      </label>
      <div ref={containerRef}></div>
      <div className="invalid-feedback">
        Please enter a complete Metro Manila delivery address.
      </div>
      <div
        ref={mapDivRef}
        className="rounded border mt-2"
        style={{ height: "220px" }}
        hidden={!placeSelected}
      ></div>
      {placeSelected && outsideMetroManila && (
        <div className="alert alert-danger small mt-2 mb-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>
          This address is outside Metro Manila. Deliveries are only available
          within Metro Manila &mdash; please choose a different address to
          continue.
        </div>
      )}
      {!placeSelected && unconfirmed && (
        <div className="alert alert-warning small mt-2 mb-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-1"></i>
          Please select your address from the suggestions list so we can
          confirm it&apos;s within Metro Manila.
        </div>
      )}
    </div>
  );
}
