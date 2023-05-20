/*eslint-disable no-unused-vars*/
const userModel = require('../models/users.js')
const imageModel = require('../models/image.js')
const tagModel = require('../models/tags.js')
const bcrypt = require('bcrypt');
/*eslint-disable no-unused-vars*/
// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  await tagModel.sync({force: true})

  // Initialise la base avec quelques données
  //const passhash = await bcrypt.hash('123456', 2)
  //console.log(passhash)
  //await userModel.create({
  //  name: 'Sebastien Viardot', email: 'Sebastien.Viardot@grenoble-inp.fr', passhash
  //})
  // Ajouter ici le code permettant d'initialiser par défaut la base de donnée

  const ruchlejs = await userModel.create({
    // key : eyJhbGciOiJIUzI1NiJ9.U2FjaGE.skjheBAbqUZEZEnupWaxxNhokzhcQ_SZH9gbCGXGAeM
    username: 'ruchlejs',
    hashedPassword: '4ec7c53222c8a758c722e2111541035ce700d5ae7bd0898c5f1b1a743e6450fd',
    name: 'Sacha',
    age: 21,
    latitude: 12.4,
    longitude: 43.5,
    sexe: 'M'
  })

  const bonmarip = await userModel.create({
    username: 'bonmarip',
    hashedPassword: '10e08a419e850eba1ebba18fdd28eb7ec1b7e8baa9bcc3b973e2b8891ec726be',
    name: 'Paul',
    age: 21,
    latitude: 9.2,
    longitude: 34.5,
    sexe: 'M'
  })

  const bonoperq = await userModel.create({
    username: 'bonoperq',
    hashedPassword: '065ed379fcd90c9fcc6f60523bc25d182a31a3f102ad9430ab5b477ba1d1504c',
    name: 'Quentin',
    age: 21,
    latitude: 10,
    longitude: 1.5,
    sexe: 'M'
  })

  const spazzolp = await userModel.create({
    username: 'spazzolp',
    hashedPassword: 'd739c312dc458fd030b08e619dcd5e8cc2d1abff5026c9316403a908c52b58a6',
    name: 'Paul-Raphael',
    age: 21,
    latitude: -19.2,
    longitude: -34.5,
    sexe: 'M'
  })

  await ruchlejs.addUnreviewedProfile(bonmarip);
  await ruchlejs.addUnreviewedProfile(bonoperq);
  await ruchlejs.addUnreviewedProfile(spazzolp);

  await bonmarip.addUnreviewedProfile(ruchlejs);
  await bonmarip.addUnreviewedProfile(bonoperq);
  await bonmarip.addUnreviewedProfile(spazzolp);

  await bonoperq.addUnreviewedProfile(ruchlejs);
  await bonoperq.addUnreviewedProfile(bonmarip);
  await bonoperq.addUnreviewedProfile(spazzolp);

  await spazzolp.addUnreviewedProfile(ruchlejs);
  await spazzolp.addUnreviewedProfile(bonmarip);
  await spazzolp.addUnreviewedProfile(bonoperq);


  await userModel.create({
    username: 'admin',
    hashedPassword: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    name: 'admin',
    age: 100,
    latitude: 9.2,
    longitude: 34.5,
    sexe: 'F'
  })

  // Initialise la base avec les styles par defauts
  await tagModel.create({
    name: 'Rock'
  })

  await tagModel.create({
    name: 'Pop'
  })

  await tagModel.create({
    name: 'Jazz'
  })

  await tagModel.create({
    name: 'Soul'
  })

  await tagModel.create({
    name: 'Rap'
  })

  await tagModel.create({
    name: 'Folk'
  })

  await tagModel.create({
    name: 'Punk'
  })

  await tagModel.create({
    name: 'Metal'
  })

  await tagModel.create({
    name: 'Hip-hop'
  })

  await tagModel.create({
    name: 'RnB'
  })

  await tagModel.create({
    name: 'Blues'
  })

  await tagModel.create({
    name: 'Country'
  })

  await tagModel.create({
    name: 'Funk'
  })

  await tagModel.create({
    name: 'Reggae'
  })

  await tagModel.create({
    name: 'Electro'
  })
  
})()