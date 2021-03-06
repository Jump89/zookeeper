const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const{ animals } = require('./data/animals.json');

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalArray as filteredResults here:
    let filterResults = animalsArray;
    if (query.personalityTraits){
        // save personalityTraits as a dedicated array
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray =[query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits arry:
        personalityTraitsArray.forEach(trait => {
            filterResults = filterResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            // Check that trait against each animal in the filteredResults arry.
            // Remember, it is initially a copy of the animalArray,but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults arry will then contain only the entries that contain the trait, so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop finished.
            );
        });
    }

    if (query.diet) {
        filterResults = filterResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filterResults = filterResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filterResults = filterResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filterResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
      if (result) {
        res.json(result);
      }
      else {
        res.send(404);
      }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
});