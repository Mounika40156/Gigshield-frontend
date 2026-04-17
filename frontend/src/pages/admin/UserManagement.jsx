import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useAdmin } from '../../context/AdminContext';

export default function UserManagement() {
  const { users, fetchUsers, updateUser, deleteUser } = useAdmin();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.city || '').toLowerCase().includes(q) ||
      (u.platform || '').toLowerCase().includes(q) ||
      (u.id || '').toLowerCase().includes(q)
    );
  });

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      city: user.city || '',
      platform: user.platform || '',
      daily_earnings: user.daily_earnings || 800,
      trust_score: user.trust_score || 42,
    });
  };

  const handleSave = async () => {
    const result = await updateUser(editingUser, editForm);
    if (!result.error) {
      setMessage('User updated successfully');
      setEditingUser(null);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}" and their policy? This cannot be undone.`)) return;
    const result = await deleteUser(userId);
    if (!result.error) {
      setMessage('User deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="main-content">
        <div className="page-header">
          <h1>User Management</h1>
          <p>View, edit, and manage all registered gig workers</p>
        </div>

        {message && (
          <div className={`alert ${message.startsWith('Error') ? 'alert-red' : 'alert-green'} mb-16`}>
            <span>{message}</span>
          </div>
        )}

        {/* Search + Stats */}
        <div className="flex items-center justify-between mb-16">
          <input
            className="form-input"
            style={{ maxWidth: 320 }}
            placeholder="Search by name, phone, city, platform, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="badge badge-blue">{filtered.length} users</span>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>City</th>
                <th>Platform</th>
                <th>Daily Earnings</th>
                <th>Trust Score</th>
                <th>Risk Zone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-3" style={{ padding: 40 }}>
                    {search ? 'No users match your search' : 'No users registered yet'}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontSize: 12, fontFamily: 'monospace' }}>{user.id}</td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: 12, width: 120 }}
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        <span className="font-600">{user.name}</span>
                      )}
                    </td>
                    <td>{user.phone}</td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: 12, width: 140 }}
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: 12, width: 100 }}
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        />
                      ) : (
                        user.city
                      )}
                    </td>
                    <td>{user.platform}</td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          className="form-input"
                          type="number"
                          style={{ padding: '4px 8px', fontSize: 12, width: 80 }}
                          value={editForm.daily_earnings}
                          onChange={(e) => setEditForm({ ...editForm, daily_earnings: parseFloat(e.target.value) || 0 })}
                        />
                      ) : (
                        `Rs. ${user.daily_earnings}`
                      )}
                    </td>
                    <td>
                      {editingUser === user.id ? (
                        <input
                          className="form-input"
                          type="number"
                          style={{ padding: '4px 8px', fontSize: 12, width: 60 }}
                          value={editForm.trust_score}
                          onChange={(e) => setEditForm({ ...editForm, trust_score: parseInt(e.target.value) || 0 })}
                        />
                      ) : (
                        <span>{user.trust_score}/100</span>
                      )}
                    </td>
                    <td>
                      {user.risk_profile?.zone && (
                        <span className={`badge badge-${user.risk_profile.zone === 'LOW' ? 'green' : user.risk_profile.zone === 'MEDIUM' ? 'yellow' : 'red'}`}>
                          {user.risk_profile.zone}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-6">
                        {editingUser === user.id ? (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditingUser(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-outline btn-sm" onClick={() => handleEdit(user)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id, user.name)}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
