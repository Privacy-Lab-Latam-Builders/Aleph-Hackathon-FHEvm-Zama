import React, { useState } from 'react';

// Define the type for each row of data in the table
interface DataRow {
  price: number;
  yesNo: 'yes' | 'no';
}

const TableWithButton: React.FC = () => {
  // Initial data (array of rows with price and yes/no)
  const [data, setData] = useState<DataRow[]>([
    { price: 100, yesNo: 'yes' },
    { price: 200, yesNo: 'no' },
    { price: 300, yesNo: 'yes' },
  ]);

  // State for showing the "hello" message when button is clicked
  const [message, setMessage] = useState<string>('');

  // Handle button click
  const handleProcessClick = () => {
    setMessage('Encrypted win: ___ Decrypted win: __');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bidders</h1>
      
      {/* Table to display data */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Price</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Yes/No</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>${row.price}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{row.yesNo}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to process the data */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleProcessClick}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Process
        </button>
      </div>

      {/* Display the message when button is clicked */}
      {message && <h2 style={{ marginTop: '20px', color: 'green' }}>{message}</h2>}
    </div>
  );
};

export default TableWithButton;

