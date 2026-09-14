"use client";

import { useEffect, useState } from "react";

// Kept in sync with Navbar's own hide threshold so both react together.
const SHOW_THRESHOLD = 80;

export default function ScrollToTopButton({ raised = false }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_THRESHOLD);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      className={`scroll-to-top-btn btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center${
        visible ? " scroll-to-top-btn--visible" : ""
      }${raised ? " scroll-to-top-btn--raised" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <i className="bi bi-arrow-up" aria-hidden="true"></i>
    </button>
  );
}
