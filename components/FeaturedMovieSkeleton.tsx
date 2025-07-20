const FeaturedMovieSkeleton = () => {
  return (
    <div className="relative h-[70vh] mb-12 rounded-lg overflow-hidden bg-gray-800 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="relative h-full flex items-center px-8">
        <div className="hidden md:block mr-8">
          <div className="bg-gray-700 rounded-lg shadow-2xl h-[500px] w-[350px]"></div>
        </div>
        <div className="flex-1">
          <div className="h-10 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="flex space-x-4 mb-4">
            <div className="h-6 bg-gray-700 rounded w-16"></div>
            <div className="h-6 bg-gray-700 rounded w-24"></div>
            <div className="h-6 bg-gray-700 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-12 bg-gray-700 rounded w-36"></div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovieSkeleton;
