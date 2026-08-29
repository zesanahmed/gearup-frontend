"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-lg font-medium">Something went wrong</h2>
          <button onClick={() => reset()} className="underline">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
