"use client"

import { ArrowUp } from "lucide-react";
import React from "react";

const ScrollToTopButton = () => {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 bg-primary-blue hover:bg-primary-blue-100 text-white hover:text-primary-blue p-3 rounded-full shadow-md transition-colors"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTopButton;
