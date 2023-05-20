/*eslint-disable jest/valid-title*/

const app = require("../app")
const request = require("supertest")

describe("GET /discovery", () => {
  test("Test if a profile is returned", async () => {
    // Mock the userModel to return a user with one unreviewed profile
    const response = await request(app)
      .get("/discovery")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.Ym9ubWFyaXA.AmWK9etwBWx9HsVLIEXl_T23vNqkSpFRa9CpG58XJ5g"
      )

    expect(response.statusCode).toBe(200)
  })

  test("Test if token is invalid", async () => {
    const response = await request(app)
      .get("/discovery")
      .set("x-access-token", "hjsdfjkdsfjkdqsfjdsfjsdf")
    expect(response.statusCode).toBe(400)
  })
})

describe("POST /discovery", () => {
  test("Test if liking a profile works", async () => {
    const response = await request(app)
      .get("/discovery")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.Ym9ubWFyaXA.AmWK9etwBWx9HsVLIEXl_T23vNqkSpFRa9CpG58XJ5g"
      )
      //.send({data:'{"likeOrDislike":"like", "id":1}'})
    expect(response.statusCode).toBe(200)
  })
})

describe("POST /users", () => {
  test("Test if we can create a new user", async () => {
    //set a data field in the body of the request
    const response = await request(app)
      .post("/users")
      .send({
        data: '{\
"username":"zobzob",\
"hashedPassword":\
"4ec7c53222c8a758c722e2111541035ce700d5ae7bd0898c5f1b1a743e6450fd",\
"name": "Polito",\
"age": "56",\
"latitude": "0",\
"longitude": "0",\
"sexe": "M"\
}'
      })
    expect(response.statusCode).toBe(200)
  })
})

describe("GET /whoami", () => {
  test("Test if we can get the user's info", async () => {
    const response = await request(app)
      .get("/whoami")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.Ym9ubWFyaXA.AmWK9etwBWx9HsVLIEXl_T23vNqkSpFRa9CpG58XJ5g"
      )
    expect(response.body.username).toBe("bonmarip")
    expect(response.statusCode).toBe(200)
  })
})

describe("GET /users/:id", () => {
  test("Test if we can get the user's info using their id", async () => {
    const response = await request(app)
      .get("/users/1")
    expect(response.body.user.username).toBe("ruchlejs")
    expect(response.statusCode).toBe(200)
  })
})

describe("POST /:user/settings/name", () => {
  test("Test if we can change the user's name", async () => {
    const response = await request(app)
      .post("/bonmarip/settings/name")
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.Ym9ubWFyaXA.AmWK9etwBWx9HsVLIEXl_T23vNqkSpFRa9CpG58XJ5g')
      .send({data:'{"name":"Polito"}'})
    expect(response.body.message).toBe('Username updated')
    expect(response.statusCode).toBe(200)
  })
})

describe("POST /:user/settings/age", () => {
  test("Test if we can change the user's age", async () => {
    const response = await request(app)
      .post("/bonmarip/settings/age")
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiJ9.Ym9ubWFyaXA.AmWK9etwBWx9HsVLIEXl_T23vNqkSpFRa9CpG58XJ5g')
      .send({data:'{"age":"56"}'})
    expect(response.body.message).toBe('Age updated')
    expect(response.statusCode).toBe(200)

  })
})

/*************************
Test Tags
*************************/

describe("GET /:user/tags", () => {
  test("Test if get user's tag with initialized table tag", async () => {
    const response = await request(app) //requete http
      .get("/ruchlejs/tags")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(200) //verifie que le code retour est 200
    expect(response.body.message).toBe("returning ruchlejs's tags") //verifie que le message est le bon
    expect(response.body.data.length).toBe(0) //verifie que le nombre d'users est le bon
  })
})

describe('POST /:user/tags', () => {
  test("Test if the verification of the presence of the attribute data when adding a tag to a user", async () => {
    const response = await request(app) //requete http
      .post('/ruchlejs/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      const message = JSON.parse(response.text).message
    expect(response.statusCode).toBe(400) //verifie que le code retour est 400
    expect(message).toBe('You must specify the data')
  })

  test("Test if the verification of the data format is good", async () => {
    const response = await request(app) //requete http
      .post('/ruchlejs/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      .send({data:'{}'})
      const message = JSON.parse(response.text).message
    expect(response.statusCode).toBe(400) //verifie que le code retour est 400
    expect(message).toBe('You must specify the name') //verifie que le message est le bon
  })

  test("Test if the verification of the existence of the tag works well", async () => {
    const response = await request(app) //requete http
      .post('/ruchlejs/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      .send({data:'{"name":"Badtest"}'})
    expect(response.statusCode).toBe(304) //verifie que le code retour est 304
  })

  test("Test if we can add a tag to an user", async () => {
    const response = await request(app) //requete http
      .post('/ruchlejs/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      .send({data:'{"name":"Rock"}'})
    expect(response.statusCode).toBe(201) //verifie que le code retour est 201
    expect(JSON.parse(response.text).message).toBe("tag Added to ruchlejs") //verifie que le message est le bon
  })
})

describe('GET /:user/tags/:tid', () => {
  test("Test if we can get user's tag by id", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/tags/1')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(200) //verifie que le code retour est 200
    expect(response.body.message).toBe("returning ruchlejs's tag") //verifie que le message est le bon
    expect(response.body.data[0].name).toBe('Rock') //verifie que le tag affiché est le bon
    expect(response.body.data.length).toBe(1) //verifie que le nombre d'users est le bon
  })
})

describe('DELETE /:user/tags/:name', () => {
  test("Test if we can delete user's tag by its name", async () => {
    const response = await request(app) //requete http
      .delete('/ruchlejs/tags/Rock')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(201) //verifie que le code retour est 201
    expect(response.body.message).toBe("Tag deleted") //verifie que le message est le bon
  })
})

describe('GET /tags', () => {
  test("Test if we can get all the tags in the database", async () => {
    const response = await request(app) //requete http
      .get('/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(200) //verifie que le code retour est 200
    expect(response.body.message).toBe("returning all tags :") //verifie que le message est le bon
    expect(response.body.data.length).toBe(15)
  })
})


/*************************
Test Images
*************************/

describe('GET /:user/images', () => {
  test("Test if get user's tag with initialized table images", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/images')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(200) //verifie que le code retour est 200
    expect(response.body.images.length).toBe(0) //verifie que le message est le bon
  })
})

describe('POST /:user/images', () => {

  test("Test if we have an error when given a bad key for psting image", async () => {
    const response = await request(app) //requete http
      .post('/ruchlejs/images')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      .attach('badKey',`${__dirname}/image_test.png`)
      .timeout({ response: 5000 });
    expect(response.statusCode).toBe(400) //verifie que le code retour est 400
    expect(response.body.message).toBe('Unexpected field')
  })

  test("Test if we can post an image to an user", async () => {
    const response = await request(app) //requete http
      .post('/ruchlejs/images')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      .attach('image',`${__dirname}/image_test.png`)
    expect(response.statusCode).toBe(201) //verifie que le code retour est 201
    expect(response.body.message).toBe('image Added to ruchlejs')
  })
})

describe('GET /:user/images/:id', () => {

  test("Test if we can have an user's image with its id", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/images/1')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(200) //verifie que le code retour est 200
    expect(response.body.buffer).not.toBe(0)
  })
})

describe('DELETE /:user/images/:id', () => {

  test("Test if we can delete an user's image", async () => {
    const response = await request(app) //requete http
      .delete('/ruchlejs/images/1')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(201) //verifie que le code retour est 201
    expect(response.body.message).toBe("Image deleted")
  })
})

/*************************
Test Match
*************************/

describe('GET /liked/:mainId', () => {
  test("Test if we can all the user who matched with ourself whe we don't have any", async () => {
    const response = await request(app) //requete http
      .get('/liked/1')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      .timeout({ response: 5000 }); // Attendre 5 secondes pour la réponse
    expect(response.statusCode).toBe(200) //verifie que le code retour est 200
    expect(response.body.message).toBe("Vous n'avez pas de match")
  })

  test("add the first profil like to test if we can see the match", async () => {
    const response = await request(app)
      .post("/discovery")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
      .send({data:'{"likeOrDislike":"like", "id":2}'})
    expect(response.statusCode).toBe(200)
  })

  test("add the second profil like to test if we can see the match", async () => {
    const response = await request(app)
      .post("/discovery")
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.Ym9ubWFyaXA.AmWK9etwBWx9HsVLIEXl_T23vNqkSpFRa9CpG58XJ5g"
      )
      .send({data:'{"likeOrDislike":"like", "id":1}'})
    expect(response.statusCode).toBe(200)
  })

  test("Test if we can all the user who matched with ourself", async () => {
    const response = await request(app) //requete http
      .get('/liked/1')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
      )
    expect(response.statusCode).toBe(200) //verifie que le code retour est 200
    expect(response.body.message).toBe("retourne les users liked de Sacha")
  })
})

/*************************
Test Middleware
*************************/

describe('Test middleware to verify the user existence', () => {
  test("Test of the error when no x-access-token", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/tags')
    expect(response.statusCode).toBe(400) //verifie que le code retour est 400
    expect(response.body.message).toBe("you must add the header : x-access-token")
  })

  test("Test of the error when there is no x-access-token", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/tags')
      .set("x-access-token","")
    expect(response.statusCode).toBe(400) //verifie que le code retour est 400
    expect(response.body.message).toBe("no token in x-access-token")
  })

  test("Test of the error when decoding token with jws", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/tags')
      .set(
        "x-access-token",
        "badtokenOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("Invalid Token")
  })

  test("Test of the error when decoding a token of an user not define in the Database", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.em9iem9iYQ.GiF0ZgiGn0nJAE4tjXGdz4ZC6mvcrJizCTmmQdlvH10"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("User not found")
  })

  test("Test of the error when the user sending the request doesn't exist in the Database", async () => {
    const response = await request(app) //requete http
      .get('/noUser/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("This user doesn't exist")
  })

  test("Test of the error when the user sending the request doesn't match with the token", async () => {
    const response = await request(app) //requete http
      .get('/bonmarip/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("the token doesn't match the user")
  })
})

describe('Test middleware to verify the tag existence', () => {
  test("Test of the error when trying to access to a tag not associate to a user", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/tags/23')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("ruchlejs ne possède pas le tag : 23")
  })
})

describe('Test middleware to verify the image existence', () => {
  test("Test of the error when trying to access to an image not associate to a user", async () => {
    const response = await request(app) //requete http
      .get('/ruchlejs/images/12')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("ruchlejs ne possède pas l'image : 12")
  })
})

describe('Test middleware to get the id of tag with its name', () => {
  test("Test of the error when trying to access to an user who doesn't exist", async () => {
    const response = await request(app) //requete http
      .delete('/badUser/tags/Rock')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("This user doesn't exist")
  })

  test("Test of the error when trying to access to a tag which isn't associate to this user", async () => {
    const response = await request(app) //requete http
      .delete('/ruchlejs/tags/Rap')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
      expect(response.statusCode).toBe(403)
      expect(response.body.message).toBe("This tag isn't associate to this user")
    })
})

describe('Test middleware to get the user with is id', () => {
  test("Test of the error when trying to access to an user who doesn't exist", async () => {
    const response = await request(app) //requete http
      .get('/liked/7')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(403) //verifie que le code retour est 403
    expect(response.body.message).toBe("This user doesn't exist")
  })
})

describe('Unauthorized method', () => {
  test("Test middleware to access to an unauthorized method", async () => {
    const response = await request(app) //requete http
      .delete('/ruchlejs/tags')
      .set(
        "x-access-token",
        "eyJhbGciOiJIUzI1NiJ9.cnVjaGxlanM.Qn9qJ3kobInC5O1rJY0FPDbWyf2ARQunky8VgUqOtv8"
        )
    expect(response.statusCode).toBe(405) //verifie que le code retour est 403
    expect(response.body.message).toBe("not a method")
  })
})