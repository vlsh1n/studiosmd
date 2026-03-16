"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ro">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f9f9f7" }}>
        <div style={{ padding: "3rem 1.5rem", textAlign: "center", maxWidth: "480px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Ceva a mers greșit · Что-то пошло не так
          </h1>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "1.5rem" }}>
              #{error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.25rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              background: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Încearcă din nou · Попробовать снова
          </button>
        </div>
      </body>
    </html>
  );
}
