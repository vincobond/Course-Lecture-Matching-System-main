import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/api.js';
import { Plus, Edit, Trash2, GraduationCap, Mail, Hash, Calendar } from 'lucide-react';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

function StudentsTab() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const students = useQuery(api.students.getStudents) || [];
  const addStudent = useMutation(api.auth.createStudentAccount);
  const updateStudent = useMutation(api.students.updateStudent);
  const deleteStudent = useMutation(api.students.deleteStudent);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    department: '',
    year: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await updateStudent({ id: editingStudent._id, ...formData });
        setEditingStudent(null);
      } else {
        await addStudent(formData);
      }
      setFormData({
        name: '',
        email: '',
        studentId: '',
        department: '',
        year: 1,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      department: student.department,
      year: student.year,
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteStudent({ id: studentToDelete._id });
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Students</h2>
          <p className="text-sm sm:text-base text-neutral-600">Manage student information and registrations</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingStudent(null);
            setFormData({
              name: '',
              email: '',
              studentId: '',
              department: '',
              year: 1,
            });
          }}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            {editingStudent ? 'Edit Student' : 'Add New Student'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 2024001"
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="input-field"
                required
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
                <option value={5}>5th Year</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingStudent ? 'Update Student' : 'Add Student'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingStudent(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Students List */}
      <div className="space-y-3">
        {students.map((student) => (
          <div key={student._id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 truncate">{student.name}</h4>
                  <p className="text-sm text-neutral-600 truncate">{student.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs font-medium">
                    {student.studentId}
                  </span>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                    Year {student.year}
                  </span>
                  <span className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded text-xs font-medium">
                    {student.department}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                    title="Edit Student"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(student)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Delete Student"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {students.length === 0 && (
          <div className="card text-center py-8">
            <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500">No students found</p>
            <p className="text-sm text-neutral-400">Add your first student to get started</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message="Are you sure you want to delete this student? This will permanently remove all their data including registrations."
        itemName={studentToDelete?.name}
        itemType="student"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default StudentsTab;

