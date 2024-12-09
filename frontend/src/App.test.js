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
test('shows no components when user name does not match', async () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/Ime uporabnika/i), { target: { value: 'NonExistentUser' } });
  await waitFor(() => expect(screen.queryByText(/NonExistentUser/i)).not.toBeInTheDocument());
});

//2
test('shows user name filter input field', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Ime uporabnika/i)).toBeInTheDocument();
});

//3
test('shows component name filter input field', () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/Ime komponente/i)).toBeInTheDocument();
});

//4
test('shows correct placeholder text for component name filter', () => {
  render(<App />);
  
  // Preveri, da je placeholder tekst za vnos imena komponente pravilen
  const componentNameInput = screen.getByPlaceholderText(/Ime komponente/i);
  expect(componentNameInput).toBeInTheDocument();  // Preveri, da je vnosno polje prisotno
});


//5 
test('shows main title on the page', () => {
  render(<App />);

  // Preveri, ali je glavni naslov "Računalniške komponente" prisoten na strani
  const mainTitle = screen.getByText(/Računalniške komponente/i);
  expect(mainTitle).toBeInTheDocument(); // Preveri, da je naslov prisoten
});
