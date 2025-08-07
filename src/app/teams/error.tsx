"use client";
export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
