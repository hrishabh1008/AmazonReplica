import React, { useState, useEffect } from 'react';

const Payments = () => {
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false); // Initially set to false
  const [cardDetails, setCardDetails] = useState(null);
  const [cardImage, setCardImage] = useState(null);

  useEffect(() => {
    fetchCardDetails();
  }, []);

  useEffect(() => {
    if (cardDetails && cardDetails.cardNumber) {
      setCardImageBasedOnCardNumber(cardDetails.cardNumber);
    }
  }, [cardDetails]);

  const setCardImageBasedOnCardNumber = (cardNumber) => {
    if (cardNumber.startsWith('4')) {
      setCardImage('https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg');
    } else if (cardNumber.startsWith('5')) {
      setCardImage('https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg');
    } else {
      setCardImage(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      setCardImageBasedOnCardNumber(value);
    }

    if (name === 'expiryDate' && value.length === 2 && value.charAt(2) !== '/') {
      setCardInfo(prevState => ({
        ...prevState,
        [name]: value + '/'
      }));
    } else {
      setCardInfo(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const fetchCardDetails = async () => {
    try {
      const response = await fetch('https://isells-server.vercel.app/validuser', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch card details: ${errorMessage}`);
      }
  
      const responseData = await response.json();
      console.log('Fetched card details:', responseData.cardInfo); // Debugging line
      setCardDetails(responseData.cardInfo); // Assuming card details are stored in cardInfo property
    } catch (error) {
      console.error('Error fetching card details:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
  
    try {
      const hashedCardNumber = 'X'.repeat(12) + cardInfo.cardNumber.slice(-4);
      const response = await fetch('https://isells-server.vercel.app/saveCard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ ...cardInfo, cardNumber: hashedCardNumber }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cardInfo');
      }
  
      const responseData = await response.json();
      setSuccessMessage('Card information updated successfully');
      setEditMode(false);
      setCardDetails(responseData.cardInfo);

      // Clear the form fields
      setCardInfo({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
      setCardImage(null); // Clear the card image
    } catch (error) {
      console.error('Error updating cardInfo:', error);
      setError('Failed to update cardInfo. Please try again later.');
    }
  };

  const handleAddCardClick = () => {
    setEditMode(true);
  };

  const handleRemoveCardClick = async () => {
    try {
      const response = await fetch('https://isells-server.vercel.app/removeCard', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove card');
      }

      setCardDetails(null);
      setCardImage(null);
      setSuccessMessage('Card information removed successfully');
    } catch (error) {
      console.error('Error removing card:', error);
      setError('Failed to remove card. Please try again later.');
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setCardInfo({
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    setError(null);
    setSuccessMessage('');
    setCardImage(null);
  };

  return (
    <div className="container">
      <h2 className="title">Payment Method</h2>
      {cardDetails && (
        <div className="card-information">
          <h3>Save Card:</h3>
          <p>Card No: {cardDetails.cardNumber}</p>
          {cardImage && <img src={cardImage} alt="Card issuer" className="card-image" />}
        </div>
      )}
      {error && <div className="message error-message">{error}</div>}
      {successMessage && <div className="message success-message">{successMessage}</div>}
      
      {!editMode && (
        <button className="button" onClick={handleAddCardClick}>Add Card</button>
      )}

      {editMode && (
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Card Number:</label>
            <input
              type="text"
              name="cardNumber"
              value={cardInfo.cardNumber}
              onChange={handleInputChange}
              maxLength={16}
              placeholder="Enter card number"
              required
            />
            {cardImage && <img src={cardImage} alt="Card issuer" className="card-image" />}
          </div>
          <div className="input-container"> 
            <label>Expiry Date:</label>
            <input
              type="text"
              name="expiryDate"
              value={cardInfo.expiryDate}
              onChange={handleInputChange}
              maxLength={5}
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="input-container">
            <label>CVV:</label>
            <input
              type="text"
              name="cvv"
              value={cardInfo.cvv}
              onChange={handleInputChange}
              maxLength={3}
              placeholder="Enter CVV"
              required
            />
          </div>
          <div className="buttons-container">
            <button className="button" type="submit">Save Card</button>
            <button className="button" type="button" onClick={handleCancelClick}>Cancel</button>
          </div>
        </form>
      )}

      {cardDetails && (
        <button className="button" onClick={handleRemoveCardClick}>Remove</button>
      )}
    </div>
  );
};

export default Payments;
