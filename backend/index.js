const express = require("express");
const morgan = require("morgan"); //middleware
const cors = require("cors"); // with cors no cross origin error
const app = express();

//express.json(): Parses incoming requests with JSON payloads. This must be used before the request logger to ensure req.body is populated.
app.use(cors());
app.use(express.static("dist")); // to make express show static content (dist directory from frontend npm run build)
app.use(express.json());

// Request logger middleware

//Global Middleware: Middleware that you want to run for every request should be added using app.use() before defining your routes.

//
//costomizing the morgan logging middleware using morgan token to define that we want die data send in post requests (beware of legal requirments in Real Apps.)
morgan.token("postData", function getPostData(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

// Functions

const generateID = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};

const isDuplicate = (newPerson) =>
  !!persons.find((person) => person.name === newPerson.name);
//converting the .find result into a boolean using !!
//same as if using Boolean(persons.find((person) => person.name === newPerson.name))

// Hardcoded phone book
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// defining routes

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(`
    <p>
        Phonebook has info for ${persons.length} people 
        <br/> ${new Date()}
    <p>    
    `);
});

app.get("/api/persons/:id", (request, response) => {
  //params shows what the :id has
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end;
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    // has to be number not phone
    return response.status(400).json({
      error: "name and phone missing",
    });
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateID(),
  };
  if (isDuplicate(newPerson)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } else {
    persons = persons.concat(newPerson);
    response.json(newPerson);
  }
});

// Middleware for handling unknown endpoints

//Error-handling Middleware: Middleware for handling errors should be defined after your routes.

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

//start the server
//we want to depoly on the internet so this has to change \
/*
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
*/
// change to :
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
