import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [componentName, setComponentName] = useState('');
  const [price, setPrice] = useState('');
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]); // Dodano za filtriranje
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentComponent, setCurrentComponent] = useState({});
  const [averagePrice, setAveragePrice] = useState(0);
  const [filter, setFilter] = useState(''); // Dodano za vnos filtriranja uporabnika

  const fetchComponents = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/components');
      const data = await response.json();
      setComponents(data);
      setFilteredComponents(data); // Nastavi začetni seznam komponent na vse komponente
      calculateAveragePrice(data);
    } catch (err) {
      displayMessage('Napaka pri nalaganju komponent.', 'error');
    }
  }, []);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const calculateAveragePrice = (components) => {
    const total = components.reduce((sum, component) => sum + component.price, 0);
    setAveragePrice(components.length > 0 ? (total / components.length).toFixed(2) : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !componentName || !price) {
      displayMessage('Prosimo, izpolnite vsa polja.', 'error');
      return;
    }

    const newComponent = { userName, componentName, price: parseInt(price) };

    try {
      const response = await fetch('http://localhost:3000/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComponent),
      });

      if (response.ok) {
        displayMessage('Komponenta uspešno dodana!', 'success');
        fetchComponents();
        setUserName('');
        setComponentName('');
        setPrice('');
      } else {
        displayMessage('Napaka pri dodajanju komponente.', 'error');
      }
    } catch (err) {
      displayMessage('Napaka pri povezavi s strežnikom.', 'error');
    }
  };

  const displayMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const openUpdateModal = (component) => {
    setCurrentComponent(component);
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    const updatedComponent = {
      componentName: currentComponent.componentName,
      price: parseInt(currentComponent.price),
    };

    try {
      const response = await fetch(`http://localhost:3000/components/user/${currentComponent.userName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedComponent),
      });

      if (response.ok) {
        displayMessage('Komponenta uspešno posodobljena!', 'success');
        fetchComponents();
        setShowUpdateModal(false);
      } else {
        displayMessage('Napaka pri posodabljanju komponente.', 'error');
      }
    } catch (err) {
      displayMessage('Napaka pri povezavi s strežnikom.', 'error');
    }
  };

  const handleDelete = async (userName) => {
    try {
      const response = await fetch(`http://localhost:3000/components/user/${userName}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        displayMessage('Komponenta uspešno odstranjena!', 'success');
        fetchComponents();
      } else {
        displayMessage('Napaka pri brisanju komponente.', 'error');
      }
    } catch (err) {
      displayMessage('Napaka pri povezavi s strežnikom.', 'error');
    }
  };

  // Funkcija za filtriranje komponent glede na vnos v filtrirnem polju
  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    setFilter(filterValue);

    // Filtriraj komponente glede na ime uporabnika
    if (filterValue === '') {
      setFilteredComponents(components); // Če ni filtra, prikaži vse komponente
    } else {
      const filtered = components.filter((component) =>
        component.userName.toLowerCase().includes(filterValue.toLowerCase())
      );
      setFilteredComponents(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Računalniške komponente</h1>

      {showMessage && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Ime uporabnika" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        <input type="text" placeholder="Ime komponente" value={componentName} onChange={(e) => setComponentName(e.target.value)} required />
        <input type="number" placeholder="Cena" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <button type="submit">Dodaj komponento</button>
      </form>

      <h2>Filtriraj po uporabniku</h2>
      <input
        type="text"
        placeholder="Filtriraj po uporabniku"
        value={filter}
        onChange={handleFilterChange}
      />

      <h2>Seznam komponent</h2>
      <ul>
        {filteredComponents.map((component) => (
          <li key={component.userName} className="component-item">
            <div className="component-details">
              <p><strong>Uporabnik:</strong> {component.userName}</p>
              <p><strong>Komponenta:</strong> {component.componentName}</p>
              <p><strong>Cena:</strong> {component.price} EUR</p>
            </div>
            <div className="button-group">
              <button onClick={() => handleDelete(component.userName)}>Odstrani</button>
              <button className="update-btn" onClick={() => openUpdateModal(component)}>Posodobi</button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Povprečna cena: {averagePrice} EUR</h3>

      {/* Modal za posodobitev */}
      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <input
              type="text"
              value={currentComponent.componentName}
              onChange={(e) => setCurrentComponent({ ...currentComponent, componentName: e.target.value })}
            />
            <input
              type="number"
              value={currentComponent.price}
              onChange={(e) => setCurrentComponent({ ...currentComponent, price: e.target.value })}
            />
            <button onClick={handleUpdate}>Shrani spremembe</button>
            <button onClick={() => setShowUpdateModal(false)}>Prekliči</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
