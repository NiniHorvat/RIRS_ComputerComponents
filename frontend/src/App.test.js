import {  render, screen, fireEvent, waitFor} from '@testing-library/react';  // Dodaj uvoz funkcije render
import App from './App';
import '@testing-library/jest-dom';



//1.TEST
test('renders without crashing', () => {
  render(<App />);  // Upodobi komponento App
  // Dodaš lahko tudi preverjanje, če so elementi prisotni v DOM
  const linkElement = screen.getByText(/Računalniške komponente/i);
  expect(linkElement).toBeInTheDocument();  // Preveri, da se pojavi besedilo
});


test('renders input fields correctly', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Ime uporabnika/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Ime komponente/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Cena/i)).toBeInTheDocument();
});

//3.test

test('renders submit button', () => {
  render(<App />);
  const submitButton = screen.getByText(/Dodaj komponento/i);
  expect(submitButton).toBeInTheDocument();
});

//4.TEST
test('renders input field for Ime uporabnika', () => {
  render(<App />);

  // Preverite, ali je vnosno polje za 'Ime uporabnika' prisotno
  const userNameInput = screen.getByPlaceholderText(/Ime uporabnika/i);
  expect(userNameInput).toBeInTheDocument();  // Preveri, če je vnosno polje v DOM-u
});

//5.TEST
test('renders input field for Ime komponente', () => {
  render(<App />);

  // Preverite, ali je vnosno polje za 'Ime komponente' prisotno
  const componentNameInput = screen.getByPlaceholderText(/Ime komponente/i);
  expect(componentNameInput).toBeInTheDocument();  // Preveri, če je vnosno polje v DOM-u
});

//6.TEST
test('renders input field for Cena', () => {
  render(<App />);

  // Preverite, ali je vnosno polje za 'Cena' prisotno
  const priceInput = screen.getByPlaceholderText(/Cena/i);
  expect(priceInput).toBeInTheDocument();  // Preveri, če je vnosno polje v DOM-u
});

//7.TEST
test('renders label and value for Povprečna cena', () => {
  render(<App />);

  // Preverite, da je besedilo prisotno v DOM-u
  const averagePriceText = screen.getByText(/Povprečna cena:/i);
  expect(averagePriceText).toBeInTheDocument();
});

//8TEST
test('renders main title', () => {
  render(<App />);
  
  // Preverite, ali je naslov prisoten v DOM-u
  const titleElement = screen.getByText(/Računalniške komponente/i);
  expect(titleElement).toBeInTheDocument();
});

//9.TEST
test('renders empty component list initially', () => {
  render(<App />);
  
  // Preverite, ali seznam komponent na začetku ne vsebuje nobenih komponent
  const componentList = screen.getByRole('list');
  expect(componentList).toBeEmptyDOMElement();
});

//10TEST
test('renders add component button', () => {
  render(<App />);
  
  // Preverite, ali je gumb za dodajanje komponente prisoten
  const addButton = screen.getByRole('button', { name: /Dodaj komponento/i });
  expect(addButton).toBeInTheDocument();
});

//5 NOVIH TESTOV ZA NOVO FUNKCIONALNST

test('shows all components when filter input is empty', async () => {
  render(<App />);
  
  // Počisti filtrirno polje
  fireEvent.change(screen.getByPlaceholderText(/Filtriraj po uporabniku/i), {
    target: { value: '' }
  });

  // Preveri, da seznam vsebuje komponente
  await waitFor(() => {
    const componentList = screen.getAllByRole('listitem');
    expect(componentList.length).toBeGreaterThan(0);  // Preveri, da je seznam komponent nenavaden
  });
});

//2. TEST

test('shows no components when filter does not match', async () => {
  render(<App />);
  
  // Vnesi uporabniško ime, ki ni v seznamu komponent
  fireEvent.change(screen.getByPlaceholderText(/Filtriraj po uporabniku/i), {
    target: { value: 'NeobstoječeIme' }
  });

  // Preveri, da seznam komponent ostane prazen
  await waitFor(() => {
    const componentList = screen.queryAllByRole('listitem');
    expect(componentList.length).toBe(0);  // Preveri, da ni komponent, ki ustrezajo filtru
  });
});

//3. TEST NEPOPOLNO UJEMANJE
test('filters components by partial userName match', async () => {
  render(<App />);
  
  // Vnesi del uporabniškega imena, ki se ujema s komponento
  fireEvent.change(screen.getByPlaceholderText(/Filtriraj po uporabniku/i), {
    target: { value: 'Jan' }
  });

  // Preveri, da so vsi elementi, ki vsebujejo "Jan", prikazani
  await waitFor(() => {
    const filteredItems = screen.getAllByText(/Nini/i);
    expect(filteredItems.length).toBeGreaterThan(0);  // Preveri, da so bili rezultati filtrirani
  });
});

//4. TEST 
test('renders component list when components are available', async () => {
  render(<App />);

  // Počakaj, da se seznam komponent naloži in preveri, ali so na voljo komponente
  await waitFor(() => {
    const componentList = screen.getAllByRole('listitem');
    expect(componentList.length).toBeGreaterThan(0);  // Preveri, da seznam ni prazen
  });
});

//5. če deluje 
test('filtering works when user types in the filter field', async () => {
  render(<App />);

  // Dodaj nekaj besedila v filtrirno polje
  fireEvent.change(screen.getByPlaceholderText(/Filtriraj po uporabniku/i), {
    target: { value: 'Nini' }
  });

  // Preveri, ali je seznam komponent posodobljen in vsebuje komponente z imenom 'Janez'
  await waitFor(() => {
    const filteredItems = screen.getAllByText(/Nini/i);
    expect(filteredItems.length).toBeGreaterThan(0);  // Preveri, da so elementi filtrirani
  });
});
