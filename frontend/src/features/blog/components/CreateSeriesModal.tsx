import React, { useState } from 'react';

import { useCreateSeries } from '../hooks/useSeries';

import '../styles/series.css';

interface CreateSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSeriesModal: React.FC<CreateSeriesModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutate: createSeries } = useCreateSeries();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSeries(
      { name, description },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          onClose();
        },
      }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Series</h2>
        <form className="create-series-form" onSubmit={handleSubmit}>
          <input
            className="create-series-form__input"
            type="text"
            placeholder="Series Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <textarea
            className="create-series-form__input"
            placeholder="Description (Optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="create-series-form__actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};
