"use client";

import React from 'react';

export function LoadingIndicator() {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin"></div>
    </div>
  );
}
