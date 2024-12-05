import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [componentName, setComponentName] = useState('');
  const [price, setPrice] = useState('');
  const [components, setComponents] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or error
  const [showMessage, setShowMessage] = useState(false);

  // Funkcija za obdelavo pošiljanja obrazca
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComponent = {
      userName,
      componentName,
      price: parseInt(price),
    };

    try {
      const response = await fetch('http://localhost:3000/components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComponent),
      });

      if (response.ok) {
        setMessage('Komponenta uspešno dodana!');
        setMessageType('success');
        fetchComponents(); // Osveži seznam komponent
      } else {
        setMessage('Napaka pri dodajanju komponente.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Napaka pri povezavi s strežnikom.');
      setMessageType('error');
    }

    setShowMessage(true); // Pokaži obvestilo
    setTimeout(() => setShowMessage(false), 3000); // Skrij obvestilo po 3 sekundah
  };

  // Funkcija za pridobivanje komponent
  const fetchComponents = async () => {
    try {
      const response = await fetch('http://localhost:3000/components');
      const data = await response.json();
      setComponents(data);
    } catch (err) {
      setMessage('Napaka pri nalaganju komponent.');
      setMessageType('error');
    }
  };

  // Funkcija za brisanje komponente
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/components/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Komponenta uspešno odstranjena!');
        setMessageType('success');
        fetchComponents(); // Osveži seznam komponent
      } else {
        setMessage('Napaka pri brisanju komponente.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Napaka pri povezavi s strežnikom.');
      setMessageType('error');
    }

    setShowMessage(true); // Pokaži obvestilo
    setTimeout(() => setShowMessage(false), 3000); // Skrij obvestilo po 3 sekundah
  };

  // Naloži komponente ob zagonu
  useEffect(() => {
    fetchComponents();
  }, []);

  return (
    <div className="App">
      <div className="header">
        <h1>Računalniške komponente</h1>
      </div>

      {/* Obvestilo (pop-up) */}
      {showMessage && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="userName">Ime uporabnika:</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="componentName">Ime komponente:</label>
          <input
            type="text"
            id="componentName"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Cena:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Dodaj komponento</button>
      </form>

      <div className="components-list">
        <h2>Seznam komponent</h2>
        <ul>
          {components.map((component) => (
            <li key={component.userName} className="component-item">
              <div className="component-details">
                <p><strong>Ime uporabnika:</strong> {component.userName}</p>
                <p><strong>Ime komponente:</strong> {component.componentName}</p>
                <p><strong>Cena:</strong> {component.price} EUR</p>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(component.userName)}>
                Odstrani
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
