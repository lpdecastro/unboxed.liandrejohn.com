import Image from "next/image";
import Link from "next/link";

export default function Navbar({ active, id }) {
  return (
    <header className="sticky-top" id={id}>
      <nav className="navbar navbar-expand-lg bg-body shadow-sm">
        <div className="container">
          <Link
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            href="/"
          >
            <Image
              src="/img/logo.png"
              alt=""
              width={42}
              height={32}
              className="d-block"
            />
            <span>Unboxed</span>
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
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={active === "home" ? "#how-it-works" : "/#how-it-works"}
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
