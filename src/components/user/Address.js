import React, { useState, useEffect } from 'react';

const Address = () => {
  const [address, setAddress] = useState({
    house: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [setIsNewAddress] = useState(false);
  const [fetchedAddress, setFetchedAddress] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch('/validuser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch address');
        }
        const data = await response.json();
        if (Object.keys(data.address).length === 0) {
          setIsNewAddress(true);
          setEditMode(true);
        }
        setAddress(data.address || {});
        setFetchedAddress(data.address || {});
        setLoading(false);
      } catch (error) {
        console.error('Error fetching address:', error);
        setError('Failed to fetch address. Please try again later.');
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch('https://isells-server.vercel.app/updateAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(address),
      });
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      setSuccessMessage('Address updated successfully');
      setEditMode(false); // Exit edit mode after successful update
    } catch (error) {
      console.error('Error updating address:', error);
      setError('Failed to update address. Please try again later.');
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setAddress(fetchedAddress); // Reset the form fields to the fetched address when canceling edit
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="address-section">
      <div className="default_address">
        <h2>Default Address</h2>
        {!editMode ? (
          <React.Fragment>
            {fetchedAddress && (
              <p>
                House No: {fetchedAddress.house}, {fetchedAddress.street}, {fetchedAddress.city}, 
                {fetchedAddress.postalCode}, {fetchedAddress.state}, {fetchedAddress.country}
              </p>
            )}
            <button onClick={handleEditClick} className="button">
              Edit Address
            </button>
          </React.Fragment>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>House/Plot:</label>
              <input
                type="text"
                name="house"
                value={address.house}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Street:</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Postal Code:</label>
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <button type="submit" className="button">
              Save Address
            </button>
            <button type="button" onClick={handleCancelEdit} className="button">
              Cancel
            </button>
          </form>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default Address;
