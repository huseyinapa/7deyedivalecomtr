export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">Yükleniyor...</h2>
          <p className="text-gray-500">Lütfen bekleyin</p>
        </div>
      </div>
    </div>
  );
}
