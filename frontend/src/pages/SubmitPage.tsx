import React, { useState, FormEvent } from 'react';
import { useWalletClient } from 'wagmi';
import { getConproContract } from '../utils';

// Define the interface for the form data
interface FormData {
  price: number;
  isExperience: string;
}

const SubmitForm: React.FC = () => {
  // Initial form data state
  const [formData, setFormData] = useState<FormData>({
    price: 0,
    isExperience: '',
  });

  // Error message state
  const [error, setError] = useState<string>('');

  const {data: walletClient} = useWalletClient();

  // Handle input text change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      price: parseInt(e.target.value),
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
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!walletClient) {
      setError('Please connect your wallet first!');
      return;
    }

    // Basic validation
    if (!formData.price || !formData.isExperience) {
      setError('All fields are required!');
      return;
    }

    const conproContract = getConproContract(walletClient);
    
    try {
      await conproContract.write.submitBid([formData.price, formData.isExperience]);
      setError('');
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting bid:', error);
      setError('Error submitting bid. Please try again.');
    }

    // Reset form fields after submission
    setFormData({
      price: 0,
      isExperience: '',
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc' }}>
      <h1>Submit Bid</h1>
      <form onSubmit={handleSubmit}>
        {/* Text input field */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="price">Enter Price:</label>
          <input
            type="number"
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
