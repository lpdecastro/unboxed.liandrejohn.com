"use client";

import { useEffect } from "react";

// Loads Bootstrap's bundled JS (Popper + all components) once on the
// client only. Bootstrap's bundle touches `window`/`document` at import
// time, so it must never run during server rendering — this is why the
// import is deferred to an effect instead of a top-level import.
// Once loaded, it self-wires every `data-bs-toggle`/`data-bs-dismiss`
// element (navbar collapse, accordions, dismissible modals) with no
// further JS needed on our end.
export default function BootstrapClient() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return null;
}
