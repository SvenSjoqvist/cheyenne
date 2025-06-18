"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createUser, updateUser, deleteUser } from '@/app/lib/actions/team';
import { User } from '@prisma/client';
import Image from 'next/image';

interface TeamManagementClientProps {
  users: Omit<User, 'password'>[];
}

// Helper function to format date consistently
function formatDate(date: Date | string) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function TeamManagementClient({ users }: TeamManagementClientProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setFeedback(null);

    try {
      await createUser(formData);
      setFeedback({ type: 'success', message: 'User created successfully!' });
      setFormData({ name: '', email: '', password: '' });
      // Refresh the page to show new user
      window.location.reload();
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to create user' 
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<{ name: string; email: string }>) => {
    try {
      await updateUser(userId, updates);
      setFeedback({ type: 'success', message: 'User updated successfully!' });
      setEditingUser(null);
      // Refresh the page to show updates
      window.location.reload();
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to update user' 
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUser(userId);
      setFeedback({ type: 'success', message: 'User deleted successfully!' });
      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      setFeedback({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to delete user' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Message */}
      {feedback && (
        <div className={`p-4 rounded-md ${
          feedback.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {feedback.message}
        </div>
      )}

      {/* Create New User */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-darker-grotesque tracking-wider">Add New Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 font-darker-grotesque"
            >
              {isCreating ? 'Creating...' : 'Add User'}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-darker-grotesque tracking-wider">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.image ? (
                      <Image src={user.image} alt={user.name || ''} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name || 'No name'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      Joined: {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {editingUser === user.id ? (
                    <UserEditForm 
                      user={user} 
                      onSave={(updates) => handleUpdateUser(user.id, updates)}
                      onCancel={() => setEditingUser(null)}
                    />
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingUser(user.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Inline component for editing user
function UserEditForm({ 
  user, 
  onSave, 
  onCancel 
}: { 
  user: Omit<User, 'password'>; 
  onSave: (updates: { name: string; email: string }) => void; 
  onCancel: () => void; 
}) {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm"
        placeholder="Email"
      />
      <button
        type="submit"
        className="px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-2 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Cancel
      </button>
    </form>
  );
} 