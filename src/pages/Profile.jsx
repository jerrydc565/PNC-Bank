import React, { useState, useEffect } from "react";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    photo: null,
    accountName: "",
    email: "",
    address: "",
    nationality: "",
    gender: "",
    dob: "",
    professionalStatus: "",
    maritalStatus: "",
    accountVerification: "Verified",
  });

  useEffect(() => {
    // Load user data from localStorage
    const firstName = localStorage.getItem("firstName") || "";
    const secondName = localStorage.getItem("secondName") || "";
    const email = localStorage.getItem("userEmail") || "";

    setProfileData({
      ...profileData,
      accountName: `${firstName} ${secondName}`.trim(),
      email: email,
    });
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Logo */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-800">PNC BANK</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        {/* Profile Photo */}
        <div className="mb-6">
          <div className="w-full h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-t-lg relative">
            {profileData.photo ? (
              <img
                src={profileData.photo}
                alt="Profile"
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <i className="fa-solid fa-user text-white text-6xl"></i>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition flex items-center gap-2">
              <i className="fa-solid fa-upload"></i>
              UPLOAD
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            <span className="text-sm text-gray-600">
              {profileData.photo ? "Change photo" : "no file selected"}
            </span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Account Name:</p>
            <input
              type="text"
              name="accountName"
              value={profileData.accountName}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="font-semibold">Email:</p>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="font-semibold">Address</p>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="font-semibold">Nationality</p>
            <input
              type="text"
              name="nationality"
              value={profileData.nationality}
              onChange={handleChange}
              placeholder="Enter your nationality"
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="font-semibold">Gender</p>
            <select
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <p className="font-semibold">Date of Birth</p>
            <input
              type="date"
              name="dob"
              value={profileData.dob}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="font-semibold">Professional Status</p>
            <input
              type="text"
              name="professionalStatus"
              value={profileData.professionalStatus}
              onChange={handleChange}
              placeholder="e.g., Engineering, Business, etc."
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <p className="font-semibold">Marital Status</p>
            <select
              name="maritalStatus"
              value={profileData.maritalStatus}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <p className="font-semibold">Account Verification</p>
            <div className="flex items-center gap-2 py-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {profileData.accountVerification}
              </span>
              <i className="fa-solid fa-circle-check text-green-600"></i>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition mt-6"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
