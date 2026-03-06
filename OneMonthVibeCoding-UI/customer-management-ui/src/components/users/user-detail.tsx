import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserById } from './api/user-detail-by-id';
import type { User } from './domain/User';
import { parseStrictPositiveInteger } from '../shared/sql-input-validation';

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const parsedUserId = (() => {
    try {
      return parseStrictPositiveInteger(userId ?? '', 'User ID');
    } catch {
      return null;
    }
  })();

  const { data: user, isLoading, isError, error } = useQuery<User, Error>({
    queryKey: ['user', parsedUserId],
    queryFn: () => fetchUserById(parsedUserId as number),
    enabled: parsedUserId !== null,
  });

  if (parsedUserId === null) return <div>Error: Invalid user id.</div>;

  if (isLoading) return <div>Loading user detail...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  if (!user) return <div>No user found.</div>;

  return (
    <div>
      <h2>User Detail</h2>
      <table>
        <tbody>
          <tr><td>UserId:</td><td>{user.userId}</td></tr>
          <tr><td>UserName:</td><td>{user.userName}</td></tr>
          <tr><td>LastName:</td><td>{user.lastName}</td></tr>
          <tr><td>Date of Birth:</td><td>{user.dateOfBirth}</td></tr>
          <tr><td>Email:</td><td>{user.email}</td></tr>
          <tr><td>Is Active:</td><td>{user.isActive ? 'Yes' : 'No'}</td></tr>
          <tr><td>Created At:</td><td>{user.createdAt}</td></tr>
          <tr><td>Updated At:</td><td>{user.updatedAt}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserDetail;
