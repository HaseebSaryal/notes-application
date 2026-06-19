import React from 'react';
import { Link } from 'react-router';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Container Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body items-center text-center px-4 sm:px-8 py-6 sm:py-8">
            {/* 404 Illustration */}
            <img
              src="/404-error.png"
              alt="Page not found illustration"
              className="mb-4 h-28 w-full max-w-[14rem] object-contain sm:mb-6 sm:h-40 sm:max-w-xs"
            />

          

            {/* Error Code */}
            <h1 className="mb-2 text-4xl font-black text-primary sm:text-6xl">404</h1>

            {/* Main Message */}
            <h2 className="mb-2 text-xl font-bold text-base-content sm:text-2xl">
              Page Not Found
            </h2>

            {/* Description */}
            <p className="mb-6 leading-relaxed text-sm text-base-content/70 sm:mb-8 sm:text-base">
              Oops! The page you're looking for seems to have wandered off. It might have been moved, deleted, or never existed at all.
            </p>

            {/* Visual Separator */}
            <div className="divider my-3 sm:my-4"></div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3 sm:max-w-sm">
              <Link
                to="/"
                className="btn btn-primary w-full gap-2"
              >
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                Back to Home
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="btn btn-ghost w-full"
              >
                Go Back
              </button>
            </div>

            {/* Fun Fact */}
            {/* <div className="mt-8 p-4 bg-base-200 rounded-lg border border-base-300">
              <p className="text-sm text-base-content/60">
                💡 <span className="font-semibold">Tip:</span> Double-check the URL and try again, or head back to your notes!
              </p>
            </div> */}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-center">
          <p className="text-base-content/40 text-sm">
            Error Code: 404 • Page Not Found
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
