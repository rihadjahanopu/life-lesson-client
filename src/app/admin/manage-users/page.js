'use client';

import { useEffect, useState } from 'react';
import { Search, Shield, ShieldOff, Trash2, Crown, Ban, ShieldCheck, Clock, X, AlertTriangle } from 'lucide-react';
import { adminService } from '@/services';
import { formatDateShort } from '@/utils';
import toast from 'react-hot-toast';

// Block Modal Component
function BlockModal({ user, onClose, onConfirm }) {
  const [blockType, setBlockType] = useState('temporary'); // 'temporary' | 'permanent'
  const [blockedUntil, setBlockedUntil] = useState('');
  const [loading, setLoading] = useState(false);

  // Default to 1 day from now
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBlockedUntil(tomorrow.toISOString().slice(0, 16));
  }, []);

  const handleConfirm = async () => {
    if (blockType === 'temporary' && !blockedUntil) {
      toast.error('Please select a date/time');
      return;
    }
    if (blockType === 'temporary' && new Date(blockedUntil) <= new Date()) {
      toast.error('Block expiry must be in the future');
      return;
    }
    setLoading(true);
    await onConfirm({
      isBlocked: blockType === 'permanent',
      blockedUntil: blockType === 'temporary' ? new Date(blockedUntil).toISOString() : null,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
              <Ban size={18} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Block User</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.name} · {user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Warning */}
          <div className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Blocking this user will immediately revoke all their active sessions. They will not be able to log in until unblocked.
            </p>
          </div>

          {/* Block Type */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Block Type</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setBlockType('temporary')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  blockType === 'temporary'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Clock size={20} className={blockType === 'temporary' ? 'text-violet-600' : 'text-gray-400'} />
                <span className={`text-sm font-medium ${blockType === 'temporary' ? 'text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  Temporary
                </span>
              </button>
              <button
                onClick={() => setBlockType('permanent')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  blockType === 'permanent'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Ban size={20} className={blockType === 'permanent' ? 'text-red-600' : 'text-gray-400'} />
                <span className={`text-sm font-medium ${blockType === 'permanent' ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  Permanent
                </span>
              </button>
            </div>
          </div>

          {/* Date/Time Picker for temporary */}
          {blockType === 'temporary' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Block Until
              </label>
              <input
                type="datetime-local"
                value={blockedUntil}
                onChange={(e) => setBlockedUntil(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-violet-500"
              />
              {/* Quick presets */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {[
                  { label: '1 day', hours: 24 },
                  { label: '3 days', hours: 72 },
                  { label: '1 week', hours: 168 },
                  { label: '1 month', hours: 720 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const d = new Date();
                      d.setHours(d.getHours() + preset.hours);
                      setBlockedUntil(d.toISOString().slice(0, 16));
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {blockType === 'permanent' && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-700 dark:text-red-300">
                This is a <strong>permanent block</strong>. The user will be blocked indefinitely until manually unblocked by an admin.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {blockType === 'permanent' ? 'Block Permanently' : 'Block User'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper: check if user is currently blocked (temporary or permanent)
function isUserBlocked(user) {
  if (user.isBlocked) return true;
  if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) return true;
  return false;
}

function getBlockLabel(user) {
  if (user.isBlocked) return 'Permanently blocked';
  if (user.blockedUntil && new Date(user.blockedUntil) > new Date()) {
    return `Blocked until ${formatDateShort(user.blockedUntil)}`;
  }
  return null;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [blockModalUser, setBlockModalUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers({ search });
      setUsers(data.users || []);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handlePromote = async (user) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      await adminService.updateUser(user.id || user._id, { role: newRole });
      setUsers(users.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
      toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}`);
    } catch { toast.error('Failed to update user'); }
  };

  const handleTogglePremium = async (user) => {
    try {
      await adminService.updateUser(user.id || user._id, { isPremium: !user.isPremium });
      setUsers(users.map((u) => (u._id === user._id ? { ...u, isPremium: !u.isPremium } : u)));
      toast.success(`Premium ${user.isPremium ? 'removed' : 'granted'}`);
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleBlock = async (user, blockData) => {
    try {
      await adminService.updateUser(user._id, blockData);
      setUsers(users.map((u) =>
        u._id === user._id ? { ...u, ...blockData } : u
      ));
      toast.success(blockData.isBlocked ? 'User permanently blocked' : `User temporarily blocked`);
      setBlockModalUser(null);
    } catch { toast.error('Failed to block user'); }
  };

  const handleUnblock = async (user) => {
    try {
      await adminService.updateUser(user._id, { isBlocked: false, blockedUntil: null });
      setUsers(users.map((u) =>
        u._id === user._id ? { ...u, isBlocked: false, blockedUntil: null } : u
      ));
      toast.success('User unblocked successfully');
    } catch { toast.error('Failed to unblock user'); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Users</h2>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 text-sm font-medium text-gray-500">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Premium</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Joined</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const blocked = isUserBlocked(u);
                  const blockLabel = getBlockLabel(u);
                  return (
                    <tr key={u._id} className={`border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors ${blocked ? 'bg-red-50/40 dark:bg-red-900/10' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {u.photoURL
                              ? <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                              : <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xs text-violet-600 dark:text-violet-300 font-semibold">{u.name?.[0]}</div>
                            }
                            {blocked && (
                              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <Ban size={8} className="text-white" />
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          u.role === 'admin'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        {blocked ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-medium w-fit">
                              <Ban size={10} />
                              {u.isBlocked ? 'Permanent' : 'Temporary'}
                            </span>
                            {blockLabel && (
                              <span className="text-xs text-gray-400 pl-0.5">{blockLabel}</span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium">
                            <ShieldCheck size={10} />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {u.isPremium && <Crown size={16} className="text-yellow-500" />}
                      </td>

                      <td className="p-4 text-sm text-gray-500">{formatDateShort(u.createdAt)}</td>

                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Promote/Demote */}
                          <button
                            onClick={() => handlePromote(u)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                            title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                          >
                            {u.role === 'admin' ? <ShieldOff size={15} /> : <Shield size={15} />}
                          </button>

                          {/* Toggle Premium */}
                          <button
                            onClick={() => handleTogglePremium(u)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                            title="Toggle Premium"
                          >
                            <Crown size={15} />
                          </button>

                          {/* Block / Unblock */}
                          {blocked ? (
                            <button
                              onClick={() => handleUnblock(u)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                              title="Unblock user"
                            >
                              <ShieldCheck size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setBlockModalUser(u)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Block user"
                            >
                              <Ban size={15} />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Search size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Block Modal */}
      {blockModalUser && (
        <BlockModal
          user={blockModalUser}
          onClose={() => setBlockModalUser(null)}
          onConfirm={(blockData) => handleBlock(blockModalUser, blockData)}
        />
      )}
    </div>
  );
}
