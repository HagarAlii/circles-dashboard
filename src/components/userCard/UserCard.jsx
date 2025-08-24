export default function UserCard({ user, formatDate }) {
  const stats = user.stats || {};
  const reportCount = user.reported || 0;
  const initial =
    user.displayName?.[0]?.toUpperCase() ||
    user.username?.[0]?.toUpperCase() ||
    "?";

  return (
    <div
      className={`
        relative
        rounded-xl
        p-6
        flex flex-col sm:flex-row
        items-center sm:items-start
        space-y-5 sm:space-y-0 sm:space-x-6
        max-w-full
        dark:bg-white
        backdrop-blur-lg
        shadow-lg shadow-black/10 dark:shadow-black/50
        text-gray-900 dark:text-gray-100
        transition-transform duration-300 ease-in-out
        hover:scale-[1] hover:shadow-xl hover:shadow-indigo-500/20
        ${user.isBlocked 
          ? 'border border-black dark:border-black' 
          : 'border border-white/20 dark:border-gray-700/40'}
      `}
      style={{
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* 🚫 Blocked badge*/}
      {user.isBlocked && (
        <div
          className="
            absolute translate-y-[-50%] top-0 right-3
            bg-black text-white
            text-[11px] font-semibold
            px-3 py-1 rounded-full
            shadow-md
            flex items-center space-x-1
            select-none
            pointer-events-none
            z-20
          "
          title="User is blocked due to excessive reports"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Blocked</span>
        </div>
      )}

      {/* ⚠️ Reported badge (below blocked badge, top-right) */}
      {reportCount > 0 && (
        <div
          className={`
            absolute
            ${user.isBlocked ? "top-10" : "top-3"} right-3
            bg-red-700 bg-opacity-90
            text-white text-[11px] font-semibold
            px-3 py-1 rounded-full
            shadow-md
            flex items-center space-x-1
            select-none
            pointer-events-none
            animate-pulse
            z-10
          `}
          title={`Reported ${reportCount} time${reportCount > 1 ? "s" : ""}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Reported {reportCount}</span>
        </div>
      )}

       {/* Avatar */}
      {user.avatarPhoto ? (
        <img
          src={user.avatarPhoto}
          alt={user.username || "User avatar"}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full shadow-2xl shadow-black bg-primary text-white flex items-center justify-center font-bold text-lg">
          {initial}
        </div>
      )}

      <div className="flex flex-col flex-grow text-center sm:text-left">
        <h3 className="text-xl font-semibold text-white truncate">
          {user.username || "N/A"}
        </h3>
        <p className="text-sm text-white dark:text-gray-400 truncate">
          {user.email || "N/A"}
        </p>
        <p className="mt-1 text-sm text-white/60">
          Age: {user.age ?? "N/A"} | Joined: {formatDate(user.createdAt)}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-primary">{stats.connections ?? 0}</p>
            <p className="text-xs text-white dark:text-gray-400">
              Connections
            </p>
          </div>
          <div>
            <p className="font-bold text-primary">{stats.circles ?? 0}</p>
            <p className="text-xs text-white dark:text-gray-400">Circles</p>
          </div>
          <div>
            <p className="font-bold text-primary">{stats.events ?? 0}</p>
            <p className="text-xs text-white dark:text-gray-400">Events</p>
          </div>
        </div>
      </div>
    </div>
  );
}
