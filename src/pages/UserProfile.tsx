import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Edit, User, Mail, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  const handleLogout = () => {
    logout();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Implement profile update logic here
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100  ">
      <div className="  bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-blue-500 p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center text-white hover:bg-blue-600 p-2 rounded-md transition"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.username}&background=random`} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-blue-300"
              />
              <button 
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2"
                onClick={() => {/* Implement profile picture upload */}}
              >
                <Edit size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Username</label>
              <div className="flex items-center">
                <User className="mr-3 text-gray-500" />
                {isEditing ? (
                  <input 
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <span className="text-gray-800">{user.username}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <div className="flex items-center">
                <Mail className="mr-3 text-gray-500" />
                {isEditing ? (
                  <input 
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  <span className="text-gray-800">{user.email}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-300 text-gray-700 p-3 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={handleEdit}
                className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition flex items-center justify-center"
              >
                <Edit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="  mt-6 bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>
          <div className="space-y-4">
            <button 
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition"
              onClick={() => {/* Implement change password */}}
            >
              Change Password
            </button>
            <button 
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition text-red-600"
              onClick={() => {/* Implement account deletion */}}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;