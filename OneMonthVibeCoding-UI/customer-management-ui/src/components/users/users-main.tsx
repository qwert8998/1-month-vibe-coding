
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllUsers } from './api/user-list';
import type { User } from './domain/User';

const UsersMain: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchAllUsers,
  });
  const [editRow, setEditRow] = useState<number | null>(null);
  const [editLastName, setEditLastName] = useState<string>('');
  const [editDoB, setEditDoB] = useState<string>('');

  // Placeholder for update mutation
  // const updateUserMutation = useMutation(updateUser, { onSuccess: () => queryClient.invalidateQueries(['users']) });

  const handleEdit = (user: User) => {
    setEditRow(user.userId);
    setEditLastName(user.lastName || '');
    setEditDoB(user.dateOfBirth);
  };

  const handleSave = () => {
    // updateUserMutation.mutate({ ...user, lastName: editLastName, dateOfBirth: editDoB });
    setEditRow(null);
  };

  const handleCancel = () => {
    setEditRow(null);
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const users: User[] = Array.isArray(data) ? data : [];

  return (
    <div>
      <h2>Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>UserId</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>UserName</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>LastName</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>DoB</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.userId}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <Link to={`/users/${user.userId}`}>{user.userId}</Link>
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.userName}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editRow === user.userId ? (
                  <input
                    value={editLastName}
                    onChange={e => setEditLastName(e.target.value)}
                  />
                ) : (
                  <span>{user.lastName}</span>
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editRow === user.userId ? (
                  <input
                    type="date"
                    value={editDoB}
                    onChange={e => setEditDoB(e.target.value)}
                  />
                ) : (
                  <span>{user.dateOfBirth}</span>
                )}
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {editRow === user.userId ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(user)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <button onClick={() => navigate('/users/create')}>Create User</button>
      </div>
    </div>
  );
};

export default UsersMain;
