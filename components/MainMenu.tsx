"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainMenu() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Diagram AI</div>
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className={`px-3 py-2 rounded-md ${pathname === '/' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
          >
            Mermaid AI
          </Link>
          <Link 
            href="/uml" 
            className={`px-3 py-2 rounded-md ${pathname === '/uml' ? 'bg-gray-900' : 'hover:bg-gray-700'}`}
          >
            UML AI
          </Link>
        </div>
      </div>
    </nav>
  );
}