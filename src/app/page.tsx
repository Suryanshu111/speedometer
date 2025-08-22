// app/page.js
"use client";
import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Speedometer Online | Free Digital Speedometer Tool</title>
        <meta
          name="description"
          content="Use our speedometer online tool to track your speed instantly with accuracy. Free digital speedometer online for all devices."
        />
        <meta name="keywords" content="speedometer online, digital speedometer, online speedometer tool, gps speedometer" />
      </Head>

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ${
            open ? "translate-x-0 w-64" : "-translate-x-full w-64"
          }`}
        >
          <div className="p-4 border-b font-bold text-xl">Sidebar</div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li className="hover:text-blue-600 cursor-pointer">Dashboard</li>
              <li className="hover:text-blue-600 cursor-pointer">Speedometer</li>
              <li className="hover:text-blue-600 cursor-pointer">Settings</li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 ml-0 md:ml-64">
          {/* Toggle Button */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-gray-700 hover:text-black fixed top-4 left-4 z-50"
          >
            ⋮
          </button>

          <h1 className="text-3xl font-bold mb-4">Speedometer Online</h1>
          <p className="mb-4">
            Welcome to the best <strong>speedometer online</strong> tool. Track your speed instantly with accuracy. 
            Our free online speedometer works across devices and browsers.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Live Speedometer</h2>
            <p className="text-gray-600">Feature under development 🚀</p>
          </div>
        </main>
      </div>
    </>
  );
}
