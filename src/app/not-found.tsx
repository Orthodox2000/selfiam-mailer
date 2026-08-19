export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <p className="text-6xl font-semibold text-gray-200">404</p>
      <p className="mt-2 text-sm text-gray-500">Page not found</p>
      <a href="/" className="mt-4 text-sm underline hover:text-black">
        Go home
      </a>
    </div>
  );
}
