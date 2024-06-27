const express = require("express");
const morgan = require("morgan"); //middleware
const cors = require("cors"); // with cors no cross origin error
require("dotenv").config();
const app = express();
const Person = require("./model/person");

morgan.token("postData", function getPostData(req) {
  return JSON.stringify(req.body);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (
    error.name === "ValidationError" ||
    error.number === "ValidationError"
  ) {
    return response.status(400).json({
      error: error.message,
    });
  }

  next(error);
};

// Request logger middleware

//Global Middleware: Middleware that you want to run for every request should be added using app.use() before defining your routes.

//
//costomizing the morgan logging middleware using morgan token to define that we want die data send in post requests (beware of legal requirments in Real Apps.)
app.use(express.static("dist")); // to make express show static content (dist directory from frontend npm run build)
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

// Functions

// const isDuplicate = (newPerson) =>
// / ! ! persons.find((person) => person.name === newPerson.name);
//converting the .find result into a boolean using !!
//same as if using Boolean(persons.find((person) => person.name === newPerson.name))

// defining routes

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((person) => {
    response.send(`
      <p>
          Phonebook has info for ${person.length} people 
          <br/> ${new Date().toString()}
      <p>    
      `);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  //params shows what the :id has
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and phone missing",
    });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));

  // if (isDuplicate(newPerson)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const newPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, newPerson, {
    new: true,
    runValidators: true,
    context: "query",
  })
    //new: true returns the updated document instead of the original document prior to the update.
    //runValidators: true ensures that the update operation enforces the schema's validation rules
    //context: 'query' sets the validation context to 'query' to properly validate fields during update operations.

    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// Middleware for handling unknown endpoints

//Error-handling Middleware: Middleware for handling errors should be defined after your routes.

app.use(unknownEndpoint);
app.use(errorHandler);
//start the server
//we want to depoly on the internet so this has to change \
/*
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
*/
// change to :
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
