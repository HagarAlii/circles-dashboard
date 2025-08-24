import { useState, useMemo, useEffect } from "react";
import useAnalyticsData from "../../hooks/useAnalyticsData";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

import BlurText from "../../components/ui/blurTxt/BlurText"; 
import SkeletonChart from "../../components/skeleton/SkeletonChart";
import { MonthlyUsersChart, CircleTypesChart } from "../../components/charts/Charts";



function formatMonthYear(monthYear) {
  const [year, month] = monthYear.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString(undefined, { year: "numeric", month: "short" });
}

function getMonthYear(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function processMonthlyData(users, selectedYear) {
  const filtered = selectedYear
    ? users.filter((u) => new Date(u.createdAt).getFullYear() === Number(selectedYear))
    : users;

  const counts = {};
  filtered.forEach((u) => {
    const key = getMonthYear(u.createdAt);
    counts[key] = (counts[key] || 0) + 1;
  });

  if (filtered.length === 0) return [];

  const dates = filtered.map(u => new Date(u.createdAt));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  let year = minDate.getFullYear();
  let month = minDate.getMonth() + 1;
  const maxYear = maxDate.getFullYear();
  const maxMonth = maxDate.getMonth() + 1;

  const data = [];
  while (year < maxYear || (year === maxYear && month <= maxMonth)) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    data.push({
      monthYear: key,
      monthLabel: formatMonthYear(key),
      count: counts[key] || 0,
    });

    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return data;
}

function normalizeCircleType(type) {
  if (!type) return "";
  const lower = type.toLowerCase();

  if (lower === "permanent" || lower === "permenent") return "Permanent";
  if (lower === "flash") return "Flash";

  return type;
}

function processCircleTypeData(circles) {
  const counts = {};

  circles.forEach(({ circleType }) => {
    if (!circleType) return;
    const normalized = normalizeCircleType(circleType);
    counts[normalized] = (counts[normalized] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export default function Analytics({ forcedChart = null, forcedYear = "" }) {
  const { data: users, loading: usersLoading } = useAnalyticsData();
  const [selectedYear, setSelectedYear] = useState(forcedYear || "");
  const [selectedChart, setSelectedChart] = useState(forcedChart || "monthly");
  const [circles, setCircles] = useState([]);
  const [circlesLoading, setCirclesLoading] = useState(true);

  useEffect(() => {
    async function fetchCircles() {
      try {
        const snapshot = await getDocs(collection(db, "circles"));
        setCircles(snapshot.docs.map(doc => doc.data()));
      } catch (err) {
        console.error("Failed to fetch circles:", err);
      } finally {
        setCirclesLoading(false);
      }
    }
    fetchCircles();
  }, []);

  const years = useMemo(() => {
    if (!users) return [];
    const yearSet = new Set(users.map(u => new Date(u.createdAt).getFullYear()));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [users]);

  const monthlyData = useMemo(() => processMonthlyData(users || [], selectedYear), [users, selectedYear]);
  const circleTypeData = useMemo(() => processCircleTypeData(circles), [circles]);

  const isLoading = usersLoading || (selectedChart === "circleTypes" && circlesLoading);

  return (
    <div
      className="p-6 pt-25 max-w-full transition-all duration-500 bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] min-h-screen"
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
          <h2 className="text-3xl font-extrabold text-primary">
            Analytics Dashboard
          </h2>
          <BlurText
            text="Detailed insights on user and circle activity"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-2xl mb-8"
          />
        </div>
      </div>

      {/* Controls */}
      {!forcedChart && (
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700
             dark:bg-gray-800  dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedChart}
            onChange={(e) => {
              setSelectedChart(e.target.value);
              setSelectedYear("");
            }}
          >
            <option value="monthly">Users Joined Per Month</option>
            <option value="circleTypes">Circle Types Distribution</option>
          </select>

          {selectedChart === "monthly" && (
            <select
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700
             dark:bg-gray-800 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="dark:bg-gray-800 p-6 rounded-xl shadow-lg min-h-[400px] flex flex-col items-center justify-center">
        {isLoading ? (
          <SkeletonChart />
        ) : (
          <>
            {selectedChart === "monthly" && (
              <>
                <h3 className="text-2xl font-semibold mb-4 text-primary">
                  Users Joined Per Month
                </h3>

                <MonthlyUsersChart data={monthlyData} />
              </>
            )}

            {selectedChart === "circleTypes" && (
              <>
                <h3 className="text-2xl font-semibold mb-4 text-primary">
                  Circles By Type
                </h3>

                 <CircleTypesChart data={circleTypeData} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
