import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from './api/create-user';
import type { User } from './domain/User';
import { useNavigate } from 'react-router-dom';
import { validateSafeTextInput } from '../shared/sql-input-validation';

const CreateUser: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/users');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fieldError =
      validateSafeTextInput(userName, 'User name') ||
      validateSafeTextInput(lastName, 'Last name') ||
      validateSafeTextInput(passwordHash, 'Password hash') ||
      validateSafeTextInput(email, 'Email');

    if (fieldError) {
      setValidationError(fieldError);
      return;
    }

    setValidationError('');

    mutation.mutate({
      userName,
      lastName,
      passwordHash,
      dateOfBirth,
      isActive,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Omit<User, 'userId'>);
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>UserName:</label>
          <input value={userName} onChange={e => setUserName(e.target.value)} required />
        </div>
        <div>
          <label>LastName:</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div>
          <label>PasswordHash:</label>
          <input value={passwordHash} onChange={e => setPasswordHash(e.target.value)} />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Is Active:</label>
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        </div>
        <button type="submit" disabled={mutation.isPending}>Create</button>
        {validationError && <div style={{color:'red'}}>{validationError}</div>}
        {mutation.isError && <div style={{color:'red'}}>Error: {(mutation.error as Error).message}</div>}
      </form>
    </div>
  );
};

export default CreateUser;
