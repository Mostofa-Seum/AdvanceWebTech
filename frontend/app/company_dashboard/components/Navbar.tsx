'use client'

import { useRouter } from "next/navigation";
import api from "@/app/services/api";

export default function Navbar() {
  const router = useRouter();

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Backend logout session cleanup failed:", err);
    } finally {
      localStorage.removeItem("user");
      router.replace("/login");
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <h2 className="font-bold text-xl text-gray-900 dark:text-white">
        Company Dashboard
      </h2>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}