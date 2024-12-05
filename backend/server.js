const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const Component = require('./models/Component');  // Uvoz modela

const app = express();
const port = 3000;

// Middleware za obdelavo JSON podatkov v telesu zahteve
app.use(bodyParser.json());
app.use(cors());

// Povezava z MongoDB (uporabite svoj connection string)
mongoose.connect('mongodb+srv://ninahorvat8:vajePTS2024@cluster.c7ule.mongodb.net/ComputerComponentsApp?retryWrites=true&w=majority')
  .then(() => console.log('Povezava z MongoDB je uspela!'))
  .catch(err => console.error('Napaka pri povezavi z MongoDB:', err));

// API pot za pridobivanje vseh komponent
app.get('/components', async (req, res) => {
    try {
      const components = await Component.find(); // Poišči vse komponente v zbirki
      res.status(200).send(components); // Pošlji jih kot odgovor
    } catch (err) {
      console.error('Napaka pri pridobivanju podatkov:', err);
      res.status(500).send({ error: 'Napaka pri pridobivanju podatkov.' });
    }
  });
  
// API pot za dodajanje nove komponente
app.post('/components', async (req, res) => {
    console.log('Prejeti podatki:', req.body);  // Debug output

    const { userName, componentName, price } = req.body;

    if (!userName || !componentName || !price) {
      return res.status(400).send({ error: 'Manjkajoči podatki!' });
    }

    const newComponent = new Component({
      userName,
      componentName,
      price,
    });

    try {
      await newComponent.save();
      res.status(201).send({ message: 'Podatki shranjeni!' });
    } catch (err) {
      console.error('Napaka pri shranjevanju podatkov:', err);
      res.status(500).send({ error: 'Napaka pri shranjevanju podatkov.' });
    }

  // API pot za brisanje komponente po imenu
app.delete('/components/name/:componentName', async (req, res) => {
    const { componentName } = req.params;  // componentName iz URL-ja
  
    try {
      // Poišči komponento z določenim imenom in jo izbriši
      const deletedComponent = await Component.findOneAndDelete({ componentName });
  
      if (!deletedComponent) {
        return res.status(404).send({ error: 'Komponenta z tem imenom ni bila najdena!' });
      }
  
      res.status(200).send({ message: 'Komponenta uspešno izbrisana!' });
    } catch (err) {
      console.error('Napaka pri brisanju podatkov:', err);
      res.status(500).send({ error: 'Napaka pri brisanju podatkov.' });
    }
  });
  
});
  // Zagon strežnika
  app.listen(port, () => {
    console.log(`Strežnik teče na http://localhost:${port}`);
  });