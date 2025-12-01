import React from "react";

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fa-regular fa-bell text-blue-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          </div>
          <p className="text-gray-600 text-sm">
            Stay updated with your account activities and important alerts
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-regular fa-bell-slash text-gray-400 text-4xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Notifications
          </h2>
          <p className="text-gray-600 mb-6">
            You're all caught up! No new notifications at this time.
          </p>
          <div className="text-sm text-gray-500">
            <p>You'll be notified when:</p>
            <ul className="mt-3 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-green-600"></i>
                <span>Transactions are completed</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-green-600"></i>
                <span>Account activities occur</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-green-600"></i>
                <span>Important security alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check-circle text-green-600"></i>
                <span>Bills are due</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
