import React, { useState } from 'react';

import { useCreateSeries } from '../hooks/useSeries';

// import '../styles/series.css';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md rounded-xl bg-surface-light p-6 shadow-xl ring-1 ring-border-light dark:bg-surface-dark dark:ring-border-dark">
        <h2 className="mb-4 text-xl font-bold text-text-primary-light dark:text-text-primary-dark">
          Create New Series
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="input-base"
            type="text"
            placeholder="Series Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <textarea
            className="input-base min-h-[100px] resize-y"
            placeholder="Description (Optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary-light hover:bg-gray-100 hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:bg-primary-900/20 dark:hover:text-text-primary-dark"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
