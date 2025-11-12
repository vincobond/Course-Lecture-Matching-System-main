import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/api.js';
import { Plus, Edit, Trash2, BookOpen, Users, Calendar, CreditCard } from 'lucide-react';
import DeleteConfirmationModal from '../ui/DeleteConfirmationModal';

function CoursesTab() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const courses = useQuery(api.courses.getCourses) || [];
  const addCourse = useMutation(api.courses.addCourse);
  const updateCourse = useMutation(api.courses.updateCourse);
  const deleteCourse = useMutation(api.courses.deleteCourse);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    specialization: '',
    credits: 3,
    semester: '',
    maxStudents: 30,
    isActive: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse._id, ...formData });
        setEditingCourse(null);
      } else {
        await addCourse(formData);
      }
      setFormData({
        title: '',
        code: '',
        description: '',
        specialization: '',
        credits: 3,
        semester: '',
        maxStudents: 30,
        isActive: true,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      code: course.code,
      description: course.description,
      specialization: course.specialization,
      credits: course.credits,
      semester: course.semester,
      maxStudents: course.maxStudents,
      isActive: course.isActive,
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteCourse({ id: courseToDelete._id });
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">Courses</h2>
          <p className="text-sm sm:text-base text-neutral-600">Manage course information and specializations</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingCourse(null);
            setFormData({
              title: '',
              code: '',
              description: '',
              specialization: '',
              credits: 3,
              semester: '',
              maxStudents: 30,
              isActive: true,
            });
          }}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="input-field"
                  placeholder="e.g., CS101"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
                required
              />
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
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2025">Spring 2025</option>
                  <option value="Summer 2025">Summer 2025</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                  max="6"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Max Students
                </label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                  className="input-field"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingCourse ? 'Update Course' : 'Add Course'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCourse(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course._id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 truncate">{course.title}</h4>
                  <p className="text-sm text-neutral-600">{course.semester}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs font-medium">
                    {course.code}
                  </span>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                    {course.specialization}
                  </span>
                  <span className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded text-xs font-medium">
                    {course.credits} Credits
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.isActive 
                      ? 'bg-success/10 text-success' 
                      : 'bg-error/10 text-error'
                  }`}>
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end space-x-3">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-neutral-400" />
                    <span className="text-sm text-neutral-600">
                      {course.currentStudents || 0}/{course.maxStudents}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-neutral-400 hover:text-primary-600 transition-colors"
                      title="Edit Course"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {courses.length === 0 && (
          <div className="card text-center py-8">
            <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500">No courses found</p>
            <p className="text-sm text-neutral-400">Add your first course to get started</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message="Are you sure you want to delete this course? This will permanently remove all course data and any associated matches."
        itemName={courseToDelete?.title}
        itemType="course"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default CoursesTab;

