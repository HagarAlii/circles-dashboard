import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center text-gray-800 dark:text-white py-10">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="mb-6">Sorry, the page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
