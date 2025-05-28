export default function ProfileSkeleton() {
  return (
    <section className="p-12 max-md:py-4 max-lg:px-0 space-y-6">
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mb-6"></div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center pb-4 border-b"
            >
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
          ))}

          <div className="h-10 w-48 bg-gray-200 rounded mt-8"></div>
        </div>
      </div>
    </section>
  );
}
