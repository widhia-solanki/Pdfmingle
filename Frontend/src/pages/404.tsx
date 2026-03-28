const NotFoundPage = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oops! The page you are looking for does not exist.
        </p>
        <a href="/" className="text-ilovepdf-red hover:underline font-semibold">
          Return to Homepage
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
