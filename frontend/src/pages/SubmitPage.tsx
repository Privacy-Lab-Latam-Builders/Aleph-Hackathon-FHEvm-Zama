import React, { useState, FormEvent } from 'react';

// Define the interface for the form data
interface FormData {
  price: string;
  isExperience: string;
}

const SubmitForm: React.FC = () => {
  // Initial form data state
  const [formData, setFormData] = useState<FormData>({
    price: '',
    isExperience: '',
  });

  // Error message state
  const [error, setError] = useState<string>('');

  // Handle input text change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      price: e.target.value,
    });
  };

  // Handle radio button change
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      isExperience: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.price || !formData.isExperience) {
      setError('All fields are required!');
      return;
    }

    setError('');
    alert('Form submitted successfully!');
    console.log(formData);

    // Reset form fields after submission
    setFormData({
      price: '',
      isExperience: '',
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>Submit Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Text input field */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="price">Enter Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleTextChange}
            placeholder="Type something"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Radio button options */}
        <div style={{ marginBottom: '10px' }}>
          <label>Do the entity experience in similar projects in the past?:</label>
          <div>
            <label style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name="option"
                value="Yes"
                checked={formData.isExperience === 'Yes'}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label style={{ marginRight: '10px' }}>
              <input
                type="radio"
                name="option"
                value="No"
                checked={formData.isExperience === 'No'}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Submit button */}
        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitForm;
