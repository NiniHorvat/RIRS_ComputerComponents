const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const Component = require('./models/Component');  // Uvoz modela

const app = express();
const port = 3000;

// Middleware za obravnavo JSON podatkov
app.use(express.json()); 
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

// API pot za pridobivanje komponente po userName
app.get('/components/user/:userName', async (req, res) => {
  const { userName } = req.params;  // Pridobimo userName iz URL-ja
  try {
    // Poišči en dokument, ki ustreza temu userName
    const component = await Component.findOne({ userName });

    if (!component) {
      return res.status(404).send({ error: 'Komponenta za tega uporabnika ni bila najdena.' });
    }

    res.status(200).send(component);  // Pošlji najdeno komponento kot odgovor
  } catch (err) {
    console.error('Napaka pri pridobivanju podatkov:', err);
    res.status(500).send({ error: 'Napaka pri pridobivanju podatkov.' });
  }
});

// API pot za dodajanje nove komponente
app.post('/components', async (req, res) => {
  console.log('Prejeti podatki:', req.body);  // Debug output

  const { userName, componentName, price } = req.body;

  // Preverite, če so vsi podatki prisotni
  if (!userName || !componentName || !price) {
    return res.status(400).send({ error: 'Manjkajoči podatki!' });
  }

  // Ustvarite nov objekt komponente
  const newComponent = new Component({
    userName,
    componentName,
    price,
  });

  try {
    // Shranite komponento v bazo
    await newComponent.save();

    // Po shranjevanju vrnite celoten objekt komponente
    res.status(201).json(newComponent);  // Spremenili smo `send` v `json`
  } catch (err) {
    console.error('Napaka pri shranjevanju podatkov:', err);
    res.status(500).send({ error: 'Napaka pri shranjevanju podatkov.' });
  }
});


// API pot za posodabljanje obstoječe komponente po userName
// API pot za posodabljanje obstoječe komponente po userName
app.put('/components/user/:userName', async (req, res) => {
  const { userName } = req.params;
  const { componentName, price } = req.body;

  if (!componentName || !price) {
    return res.status(400).send({ error: 'Manjkajoči podatki!' });
  }

  try {
    // Posodobi komponento po userName
    const updatedComponent = await Component.findOneAndUpdate(
      { userName },
      { componentName, price },
      { new: true, runValidators: true }
    );

    if (!updatedComponent) {
      return res.status(404).send({ error: 'Komponenta za tega uporabnika ni bila najdena.' });
    }

    // Po uspešnem posodabljanju, vrnemo posodobljeno komponento
    res.status(200).json(updatedComponent);
  } catch (err) {
    console.error('Napaka pri posodabljanju podatkov:', err);
    res.status(500).send({ error: 'Napaka pri posodabljanju podatkov.' });
  }
});


// DELETE: Brisanje komponente po userName
// API pot za brisanje komponente po userName
app.delete('/components/user/:userName', async (req, res) => {
  const { userName } = req.params;
  
  const trimmedUserName = userName.trim();  // Odstranimo morebitne presledke
  
  try {
    console.log('Poskušam izbrisati komponento z userName:', trimmedUserName);  // Logiranje

    const deletedComponent = await Component.findOneAndDelete({ userName: trimmedUserName });

    if (!deletedComponent) {
      console.log('Komponenta ni bila najdena');  // Logiranje neuspeha
      return res.status(404).send({ error: 'Komponenta za tega uporabnika ni bila najdena.' });
    }

    console.log('Komponenta je bila izbrisana:', deletedComponent);  // Logiranje uspeha
    // Po uspešnem brisanju, vrnemo sporočilo s podatki o izbrisani komponenti
    res.status(200).json(deletedComponent);
  } catch (err) {
    console.error('Napaka pri brisanju podatkov:', err);
    res.status(500).send({ error: 'Napaka pri brisanju podatkov.' });
  }
});


module.exports = app; 

// Zagon strežnika
app.listen(port, () => {
  console.log(`Strežnik teče na http://localhost:${port}`);
});
