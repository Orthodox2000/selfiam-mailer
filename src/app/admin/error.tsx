"use client";

export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-gray-500">Something went wrong.</p>
      <button onClick={retry} className="mt-2 text-sm underline">
        Try again
      </button>
    </div>
  );
}
