"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="card p-6 stack gap-4 text-center">
      <h2 className="text-lg font-semibold text-gray-900">
        Ceva a mers greșit · Что-то пошло не так · Something went wrong
      </h2>
      {error.digest && (
        <p className="text-xs muted">#{error.digest}</p>
      )}
      <button onClick={reset} className="btn btn-primary mx-auto cursor-pointer">
        Încearcă din nou · Попробовать снова · Try again
      </button>
    </div>
  );
}
