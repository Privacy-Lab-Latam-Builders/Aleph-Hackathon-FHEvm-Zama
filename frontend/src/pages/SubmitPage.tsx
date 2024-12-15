import React, { useState, FormEvent } from 'react';

// Define the form data interface
interface FormData {
  title: string;
  description: string;
  isImportant: boolean;
}

const SubmitPage: React.FC = () => {
  // Initialize state with the FormData interface
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    isImportant: false
  });

  // State for handling error messages
  const [error, setError] = useState<string>('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.description) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    alert('Form submitted successfully!');
    console.log(formData);

    // Clear form
    setFormData({
      title: '',
      description: '',
      isImportant: false
    });
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Submit Your Entry</h1>
      <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              name="isImportant"
              checked={formData.isImportant}
              onChange={handleChange}
            />
            Mark as important
          </label>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmitPage;
