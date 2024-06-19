const express = require("express");
const app = express();

app.use(express.json()); // without would the body prop undefined.

const generateID = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};

const isDuplicate = (newPerson) =>
  !!persons.find((person) => person.name === newPerson.name);
//converting the .find result into a boolean using !!
//same as if using Boolean(persons.find((person) => person.name === newPerson.name))
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

  if (!body.name || !body.phone) {
    return response.status(400).json({
      error: "name and phone missing",
    });
  }

  const newPerson = {
    name: body.name,
    phone: body.phone,
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

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
