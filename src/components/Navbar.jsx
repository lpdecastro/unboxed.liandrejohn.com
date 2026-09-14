"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

// Ignore scroll jitter (rubber-banding, tiny nudges) near the top before
// deciding to hide the navbar. Kept in sync with ScrollToTopButton's own
// threshold so both react at the same scroll position.
const HIDE_THRESHOLD = 80;

export default function Navbar({ active, id }) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const collapseOpenRef = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;

      if (collapseOpenRef.current || currentY <= HIDE_THRESHOLD) {
        setHidden(false);
      } else {
        setHidden(currentY > lastScrollY.current);
      }

      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Never hide the navbar while its mobile collapse menu is open.
  useEffect(() => {
    const collapseEl = document.getElementById("mainNav");
    if (!collapseEl) return undefined;

    function handleShow() {
      collapseOpenRef.current = true;
      setHidden(false);
      trackEvent("mobile_menu_toggle", { state: "open" });
    }
    function handleHidden() {
      collapseOpenRef.current = false;
      trackEvent("mobile_menu_toggle", { state: "close" });
    }

    collapseEl.addEventListener("show.bs.collapse", handleShow);
    collapseEl.addEventListener("hidden.bs.collapse", handleHidden);
    return () => {
      collapseEl.removeEventListener("show.bs.collapse", handleShow);
      collapseEl.removeEventListener("hidden.bs.collapse", handleHidden);
    };
  }, []);

  return (
    <header
      className={`sticky-top site-navbar${hidden ? " site-navbar--hidden" : ""}`}
      id={id}
    >
      <nav className="navbar navbar-expand-lg bg-body shadow-sm">
        <div className="container">
          <Link
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            href="/"
          >
            <Image
              src="/img/logo.png"
              alt=""
              width={150}
              height={50}
              className="d-block"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <li className="nav-item">
                <Link
                  className={`nav-link${active === "home" ? " active" : ""}`}
                  aria-current={active === "home" ? "page" : undefined}
                  href="/"
                  onClick={() =>
                    trackEvent("cta_click", { label: "Home", location: "navbar" })
                  }
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={active === "home" ? "#how-it-works" : "/#how-it-works"}
                  onClick={() =>
                    trackEvent("cta_click", {
                      label: "How It Works",
                      location: "navbar",
                    })
                  }
                >
                  How It Works
                </Link>
              </li>
              <li className="nav-item mt-2 mt-lg-0 ms-lg-2">
                <Link
                  className={`btn btn-primary fw-semibold rounded-pill px-3${
                    active === "games" ? " active" : ""
                  }`}
                  aria-current={active === "games" ? "page" : undefined}
                  href="/games"
                  onClick={() =>
                    trackEvent("cta_click", {
                      label: "Browse Games",
                      location: "navbar",
                    })
                  }
                >
                  Browse Games
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
