import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { SkeletonCard } from "../../components/skeleton/SkeletonRows";
import BlurText from "../../components/ui/blurTxt/BlurText";
import UserCard from "../../components/userCard/UserCard";

const USERS_PER_PAGE = 12;

function formatDate(timestamp) {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterReported, setFilterReported] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCol = collection(db, "users");
        const usersSnapshot = await getDocs(usersCol);

        const usersList = usersSnapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data, 
            };
          })
          .filter((user) => !user.isAdmin); 

        setUsers(usersList);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Reset to first page when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterReported, sortBy]);

  // Filtering
  let filteredUsers = users.filter((user) => {
    const name = (user.displayName || user.username || "").toLowerCase();
    const email = (user.email || "").toLowerCase();

    const searchMatch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const isReported = (user.reports || 0) > 0;
    const isBlocked = user.isBlocked === true;

    let reportMatch = false;
    switch (filterReported) {
      case "all":
        reportMatch = true;
        break;
      case "reported":
        reportMatch = isReported ; // reported but not blocked
        break;
      case "blocked":
        reportMatch = isBlocked;
        break;
      default:
        reportMatch = true;
    }

    return searchMatch && reportMatch;
  });

  // Sorting
  filteredUsers = filteredUsers.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      case "oldest":
        return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      case "name":
        return (a.displayName || a.username || "").localeCompare(
          b.displayName || b.username || ""
        );
      case "email":
        return (a.email || "").localeCompare(b.email || "");
      default:
        return 0;
    }
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  if (error)
    return (
      <div className="p-6 max-w-full min-h-screen flex flex-col items-center justify-center text-red-600">
        <p className="mb-4 text-lg font-semibold">{error}</p>
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );

  if (!loading && filteredUsers.length === 0)
    return (
      <div className="p-6 max-w-full min-h-screen flex flex-col items-center justify-center text-white dark:text-gray-400">
        <p className="mb-4 text-xl font-semibold">
          {filterReported === "blocked" ? "No blocked users found." : "No users found."}
        </p>
        <p>Try adjusting your filters or search criteria.</p>
      </div>
    );

  return (
    <div
      className="p-6  transition-all duration-500 bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] pt-25 max-w-full min-h-screen"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mb-8 flex items-center space-x-4">
        <svg
          className="w-10 h-10 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <div>
          <h2 className="text-3xl font-extrabold text-primary">Users Overview</h2>
          <BlurText
            text=" Detailed insights on user activity"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          aria-label="Search users"
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-full md:w-1/3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <select
          aria-label="Sort users"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name (A-Z)</option>
          <option value="email">Email (A-Z)</option>
        </select>

        <select
          aria-label="Filter reported users"
          value={filterReported}
          onChange={(e) => setFilterReported(e.target.value)}
          className="p-2 w-full md:w-1/4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Users</option>
          <option value="reported">Reported Only</option>
          <option value="blocked">Blocked Users</option>
        </select>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, idx) => <SkeletonCard key={idx} />)
          : paginatedUsers.map((user) => (
              <UserCard key={user.id} user={user} formatDate={formatDate} />
            ))}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            aria-label="Previous page"
          >
            &larr;
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  currentPage === pageNum
                    ? "bg-primary text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            aria-label="Next page"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
