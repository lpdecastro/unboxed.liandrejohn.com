import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      <Navbar id="siteHeader" />

      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container py-5 text-center" style={{ maxWidth: "36rem" }}>
          <i className="bi bi-signpost-split display-1 text-primary mb-4 d-inline-block"></i>
          <h1 className="fw-bold mb-3">Page Not Found</h1>
          <p className="text-body-secondary mb-4">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have
            moved.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link href="/" className="btn btn-primary rounded-pill px-4 fw-semibold">
              Back Home
            </Link>
            <Link
              href="/games"
              className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
            >
              Browse Games
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
