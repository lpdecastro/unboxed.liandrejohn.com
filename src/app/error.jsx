"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Navbar id="siteHeader" />

      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container py-5 text-center" style={{ maxWidth: "36rem" }}>
          <i className="bi bi-exclamation-triangle display-1 text-primary mb-4 d-inline-block"></i>
          <h1 className="fw-bold mb-3">Something Went Wrong</h1>
          <p className="text-body-secondary mb-4">
            An unexpected error occurred. Please try again — if it keeps
            happening, head back home and try from there.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-primary rounded-pill px-4 fw-semibold"
              onClick={() => reset()}
            >
              Try Again
            </button>
            <Link
              href="/"
              className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
            >
              Back Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
