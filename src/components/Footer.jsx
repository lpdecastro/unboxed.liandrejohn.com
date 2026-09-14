import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-dark text-body border-top pt-5 pb-4"
      data-bs-theme="dark"
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <Link
              className="d-flex align-items-center gap-2 fw-bold mb-2 text-body text-decoration-none"
              href="/"
            >
              <i className="bi bi-dice-5-fill text-primary fs-4"></i>
              <span>Unboxed</span>
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
                <Link
                  href="/"
                  className="link-secondary link-underline-opacity-0"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="/games"
                  className="link-secondary link-underline-opacity-0"
                >
                  Browse Games
                </Link>
              </li>
              <li className="mb-2">
                <a
                  href="#rentalPoliciesModal"
                  data-bs-toggle="modal"
                  className="link-secondary link-underline-opacity-0"
                >
                  Rental Policies
                </a>
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
            <p className="small text-body-secondary mb-0">
              Contact details coming soon.
            </p>
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
