import Link from "next/link";
import Image from "next/image";
import TrackedLink from "@/components/analytics/TrackedLink";
import TrackedElement from "@/components/analytics/TrackedElement";

export default function Footer() {
  return (
    <footer
      className="bg-dark text-body border-top pt-5 pb-4"
      data-bs-theme="dark"
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <Link className="d-inline-block mb-2" href="/">
              <Image
                src="/img/logo-dark.png"
                alt="Unboxed"
                width={150}
                height={50}
                className="d-block"
              />
            </Link>
            <p className="small text-body-secondary mb-0">
              A small personal collection of board games available for rent
              around Metro Manila.
            </p>
          </div>
          <div className="col-lg-2 col-sm-4">
            <h3 className="h6 fw-semibold mb-3">Explore</h3>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <TrackedLink
                  href="/"
                  className="link-secondary link-underline-opacity-0 text-body-secondary"
                  eventName="cta_click"
                  eventParams={{ label: "Home", location: "footer" }}
                >
                  Home
                </TrackedLink>
              </li>
              <li className="mb-2">
                <TrackedLink
                  href="/games"
                  className="link-secondary link-underline-opacity-0 text-body-secondary"
                  eventName="cta_click"
                  eventParams={{ label: "Browse Games", location: "footer" }}
                >
                  Browse Games
                </TrackedLink>
              </li>
              <li className="mb-2">
                <TrackedElement
                  as="a"
                  href="#rentalPoliciesModal"
                  data-bs-toggle="modal"
                  className="link-secondary link-underline-opacity-0 text-body-secondary"
                  eventName="open_rental_policies"
                  eventParams={{ location: "footer" }}
                >
                  Rental Policies
                </TrackedElement>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-sm-4">
            <h3 className="h6 fw-semibold mb-3">Rental Info</h3>
            <ul className="list-unstyled small text-body-secondary">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>Metro Manila only
              </li>
              <li className="mb-2">
                <i className="bi bi-wallet2 me-2"></i>Payment via GCash
              </li>
              <li>
                <i className="bi bi-truck me-2"></i>Delivery &amp; return via
                Lalamove
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-sm-4">
            <h3 className="h6 fw-semibold mb-3">Contact</h3>
            <ul className="list-unstyled small">
              <li>
                <TrackedElement
                  as="a"
                  href="https://www.facebook.com/lpdecastro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-secondary link-underline-opacity-0 d-inline-flex align-items-center gap-2 text-body-secondary"
                  eventName="cta_click"
                  eventParams={{ label: "Facebook", location: "footer" }}
                >
                  <i className="bi bi-facebook"></i>
                  Message us on Facebook
                </TrackedElement>
              </li>
            </ul>
          </div>
        </div>
        <hr className="mt-4 mb-3" />
        <p className="small text-body-secondary text-center mb-0">
          &copy; 2026 Unboxed. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
