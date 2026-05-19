import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container py-24 text-center">
      <div className="text-6xl font-display font-bold text-brand">404</div>
      <h1 className="h-section mt-3">Seite nicht gefunden</h1>
      <p className="mt-2 text-ink-muted">Die gesuchte Seite existiert leider nicht.</p>
      <Link to="/" className="btn btn-primary inline-flex mt-6">Zur Startseite</Link>
    </div>
  );
}
