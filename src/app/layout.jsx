import "../scss/main.scss";
import BootstrapClient from "@/components/BootstrapClient";

export const metadata = {
  title: "Unboxed — Board Game Rentals in Metro Manila",
  description:
    "Rent board games from a small personal collection in Metro Manila. Pick your dates, pay via GCash, and get games delivered and returned through Lalamove.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="d-flex flex-column min-vh-100">
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
