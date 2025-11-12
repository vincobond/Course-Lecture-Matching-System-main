import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/api.js';
import { Plus, Edit, Trash2, User, Mail, BookOpen, Calendar } from 'lucide-react';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

function LecturersTab() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const lecturers = useQuery(api.lecturers.getLecturers) || [];
  const addLecturer = useMutation(api.auth.createLecturerAccount);
  const updateLecturer = useMutation(api.lecturers.updateLecturer);
  const deleteLecturer = useMutation(api.lecturers.deleteLecturer);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    department: '',
    experience: 0,
    availability: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLecturer) {
        await updateLecturer({ id: editingLecturer._id, ...formData });
        setEditingLecturer(null);
      } else {
        await addLecturer(formData);
      }
      setFormData({
        name: '',
        email: '',
        specialization: '',
        department: '',
        experience: 0,
        availability: true,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving lecturer:', error);
    }
  };

  const handleEdit = (lecturer) => {
    setEditingLecturer(lecturer);
    setFormData({
      name: lecturer.name,
      email: lecturer.email,
      specialization: lecturer.specialization,
      department: lecturer.department,
      experience: lecturer.experience,
      availability: lecturer.availability,
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = (lecturer) => {
    setLecturerToDelete(lecturer);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!lecturerToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteLecturer({ id: lecturerToDelete._id });
      setShowDeleteModal(false);
      setLecturerToDelete(null);
    } catch (error) {
      console.error('Error deleting lecturer:', error);
      alert('Failed to delete lecturer. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setLecturerToDelete(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Lecturers</h2>
          <p className="text-sm sm:text-base text-neutral-600">Manage lecturer information and specializations</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingLecturer(null);
            setFormData({
              name: '',
              email: '',
              specialization: '',
              department: '',
              experience: 0,
              availability: true,
            });
          }}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lecturer</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {editingLecturer ? 'Edit Lecturer' : 'Add New Lecturer'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Computer Science, Mathematics"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value === 'true' })}
                  className="input-field"
                >
                  <option value={true}>Available</option>
                  <option value={false}>Not Available</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingLecturer ? 'Update Lecturer' : 'Add Lecturer'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingLecturer(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lecturers List */}
      <div className="space-y-3">
        {lecturers.map((lecturer) => (
          <div key={lecturer._id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 truncate">{lecturer.name}</h4>
                  <p className="text-sm text-neutral-600 truncate">{lecturer.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                    {lecturer.specialization}
                  </span>
                  <span className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded text-xs font-medium">
                    {lecturer.department}
                  </span>
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs font-medium">
                    {lecturer.experience} years
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lecturer.availability 
                      ? 'bg-success/10 text-success' 
                      : 'bg-error/10 text-error'
                  }`}>
                    {lecturer.availability ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(lecturer)}
                    className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                    title="Edit Lecturer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(lecturer)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Delete Lecturer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {lecturers.length === 0 && (
          <div className="card text-center py-8">
            <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500">No lecturers found</p>
            <p className="text-sm text-neutral-400">Add your first lecturer to get started</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Lecturer"
        message="Are you sure you want to delete this lecturer? This will permanently remove all their data including any course assignments."
        itemName={lecturerToDelete?.name}
        itemType="lecturer"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default LecturersTab;

