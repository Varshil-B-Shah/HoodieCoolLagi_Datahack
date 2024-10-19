import React from "react";
import { useUser } from "@clerk/clerk-react";
import { FileText, Book } from "lucide-react";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="h-full flex flex-col justify-center items-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-300">
        Welcome, {user.firstName}!
      </h1>
      <p className="text-md md:text-lg mb-6 text-green-100 text-center max-w-2xl">
        Your CyberSecure dashboard. Stay protected.
      </p>
      <div className="w-full max-w-2xl space-y-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3 text-green-400">
            Start Analysis
          </h2>
          <p className="text-green-100 mb-4">
            Begin your security assessment now.
          </p>
          <button className="bg-green-500 text-black text-lg font-bold py-2 px-4 rounded hover:bg-green-400 transition-colors w-full">
            <a href="/analysis">Let's Go!</a>
          </button>
        </div>
        <div className="flex space-x-4">
          <button className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors flex-1 flex flex-col items-center justify-center h-32">
            <FileText className="text-green-400" size={32} />
            <span className="text-sm text-green-100 mt-2 block">
              Final Report
            </span>
          </button>
          <button className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors flex-1 flex flex-col items-center justify-center h-32">
            <Book className="text-green-400" size={32} />
            <span className="text-sm text-green-100 mt-2 block">Resources</span>
          </button>
        </div>
      </div>
      <footer className="p-4 text-center">
        <p className="text-sm text-green-200">
          © 2024 CyberSecure. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
