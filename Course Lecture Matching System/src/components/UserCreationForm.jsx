import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../convex/api.js';
import { User, GraduationCap, Users, Plus, X } from 'lucide-react';

function UserCreationForm({ onClose }) {
  const [userType, setUserType] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    // Student fields
    studentId: '',
    department: '',
    year: 1,
    // Lecturer fields
    specialization: '',
    experience: 0,
  });

  // Mutations
  const createAdmin = useMutation(api.auth.createAdminAccount);
  const createLecturer = useMutation(api.auth.createLecturerAccount);
  const createStudent = useMutation(api.auth.createStudentAccount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (userType === 'admin') {
        result = await createAdmin({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        });
      } else if (userType === 'lecturer') {
        result = await createLecturer({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          specialization: formData.specialization,
          department: formData.department,
          experience: formData.experience,
        });
      } else if (userType === 'student') {
        result = await createStudent({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          studentId: formData.studentId,
          department: formData.department,
          year: formData.year,
        });
      }

      setSuccess(`${userType.charAt(0).toUpperCase() + userType.slice(1)} account created successfully!`);
      
      // Reset form
      setFormData({
        email: '',
        name: '',
        password: '',
        studentId: '',
        department: '',
        year: 1,
        specialization: '',
        experience: 0,
      });
      
      // Close form after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Create New User</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                User Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'admin', label: 'Admin', icon: Users, color: 'text-red-600' },
                  { value: 'lecturer', label: 'Lecturer', icon: User, color: 'text-blue-600' },
                  { value: 'student', label: 'Student', icon: GraduationCap, color: 'text-green-600' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setUserType(option.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        userType === option.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mx-auto mb-1 ${option.color}`} />
                      <span className="text-xs font-medium text-neutral-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input-field"
                placeholder="user@university.edu"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="input-field"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Student-specific fields */}
            {userType === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => handleInputChange('studentId', e.target.value)}
                    className="input-field"
                    placeholder="STU001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="input-field"
                    placeholder="Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Academic Year
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className="input-field"
                    required
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                  </select>
                </div>
              </>
            )}

            {/* Lecturer-specific fields */}
            {userType === 'lecturer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="input-field"
                    placeholder="Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="input-field"
                    placeholder="Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                    className="input-field"
                    placeholder="5"
                    required
                  />
                </div>
              </>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserCreationForm;
