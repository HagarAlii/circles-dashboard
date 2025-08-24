import React, { useEffect, useMemo, useState } from "react";
import { Users, Circle ,Activity } from "lucide-react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import {
  MonthlyUsersChart,
  CircleTypesChart,
} from "../../components/charts/Charts";
import BlurText from "../../components/ui/blurTxt/BlurText";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [circles, setCircles] = useState([]);
  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  useEffect(() => {
    async function fetchData() {
      const usersSnap = await getDocs(collection(db, "users"));
      const circlesSnap = await getDocs(collection(db, "circles"));
      
      setUsers(usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setCircles(circlesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    fetchData();
  }, []);

  // Prepare monthly users data for chart
  const monthlyUsersData = (() => {
    if (!users.length) return [];

    const counts = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    users.forEach((user) => {
      if (!user.createdAt) return;
      const date = user.createdAt.toDate
        ? user.createdAt.toDate()
        : new Date(user.createdAt);
      if (date.getFullYear() === currentYear) {
        counts[date.getMonth()]++;
      }
    });

    return counts.map((count, index) => ({
      monthLabel: monthLabels[index],
      count,
    }));
  })();


  function normalizeCircleType(type) {
  if (!type) return "";
  const lower = type.toLowerCase();

  if (lower === "permanent" || lower === "permenent") return "Permanent";
  if (lower === "flash") return "Flash";

  return type;
}

  // Prepare circle types data
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
const circleTypeData = useMemo(() => processCircleTypeData(circles), [circles]);

  return (
    <div
      className="min-h-screen  transition-all duration-500 bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]
      px-8 pt-25 py-12 text-white font-sans"
    >
      <div className=" mx-auto">
        {/* Header */}
        <header className="mb-14">
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 bg-purple-700/70 backdrop-blur-md rounded-full
              flex items-center justify-center text-white shadow-lg animate-pulse"
            >
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1
                className="text-4xl font-extrabold tracking-wide relative inline-block
                before:absolute before:-bottom-2 before:left-0 before:w-full before:h-1
                before:bg-gradient-to-r before:from-purple-400 before:via-pink-500 before:to-red-500
                before:rounded-full before:opacity-70"
              >
                Admin Overview
              </h1>
              <BlurText
                text="Powerful insights to drive your platform"
                className="mt-2 text-xl text-purple-300 font-semibold tracking-wide"
                delay={100}
                animateBy="words"
                direction="up"
              />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          <StatCard
            icon={<Users className="w-7 h-7 text-purple-300" />}
            label="Total Users"
            value={users.length}
            gradient="from-purple-700 via-purple-900 to-purple-800"
          />
          <StatCard
            icon={<Circle className="w-7 h-7 text-cyan-300" />}
            label="Active Circles"
            value={circles.length}
            gradient="from-cyan-600 via-cyan-700 to-cyan-800"
          />
          <StatCard
            icon={<Activity className="w-7 h-7 text-pink-300" />}
            label="Engagement Rate"
            value="82%"
            gradient="from-pink-600 via-pink-700 to-pink-800"
          />
        </section>

        {/* Analytics */}
        <section className="flex flex-col lg:flex-row gap-12">
          <AnalyticsCard title={`Monthly User Signups (${new Date().getFullYear()})`}>
            <MonthlyUsersChart data={monthlyUsersData} />
          </AnalyticsCard>

          <AnalyticsCard title="Circle Types Distribution">
            <CircleTypesChart data={circleTypeData} />
          </AnalyticsCard>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br ${gradient}
      p-6 shadow-xl backdrop-blur-md bg-white/10 border border-white/20
      transform hover:scale-[1.05] hover:shadow-2xl transition duration-300 cursor-pointer`}
    >
      <div
        className="absolute -top-5 right-5 w-12 h-12 bg-white/20 rounded-full
        flex items-center justify-center filter drop-shadow-lg"
      >
        {icon}
      </div>
      <div className="mt-8">
        <p className="text-sm text-purple-200 font-semibold uppercase tracking-widest">
          {label}
        </p>
        <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
          {value}
        </h2>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, children }) {
  return (
    <div
      className="flex-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20
      p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <h3 className="mb-6 text-xl font-semibold text-purple-200">{title}</h3>
      <div className="min-h-[300px]">{children}</div>
    </div>
  );
}
