//const express = require('express');
const app = require('./app')

require('mandatoryenv').load(['PORT'])
const { PORT } = process.env



// enregistrement d'une callback sur reception
// d'une requete HTTP GET correspondant a la
// racine du site.
app.get('/', (req, res) => {
    res.send('Hello World');
})

// Aucune autre callback n'etant enregistree, toute demande autre
// que la racine affichera une erreur

// demarrage du serveur sur le port 3000
app.listen(
    PORT,
    () => console.info('Server listening on port ', PORT)
  )
  