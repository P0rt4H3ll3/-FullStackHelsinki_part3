import { useState, useEffect } from "react";
import Person from "./components/Person";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import updateService from "./service/updateserver";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [matchName, setMatchName] = useState(persons);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    //display search names
    setMatchName(
      persons.filter((person) =>
        person.name.toLowerCase().includes(searchName.toLowerCase())
      )
    );
  }, [searchName, persons]);

  useEffect(() => {
    // display initial phonebook
    updateService.getAll().then((initialPhonebook) => {
      setPersons(initialPhonebook);
    });
  }, []);

  const addData = (event) => {
    event.preventDefault();
    // first verify that imput fields are not empty to avoid adding empty names
    if (newName.trim() == "" || newNumber.trim() == "") {
      !newName && !newNumber
        ? alert("you have to input a Name and Number")
        : !newNumber
        ? alert("you have to input a Number")
        : alert("you have to input a Name");
    } else {
      // if input fields !empty than greate a object with person to be added to Phonebook
      const dataObject = {
        // (no id, is handled by backend)
        name: newName,
        number: newNumber,
      };
      //check if name already exists
      if (isDuplicate(dataObject.name)) {
        if (
          // if name already exists, warn user and ask if want to update
          window.confirm(
            `${dataObject.name} is already added to phonebook, replace the old number with a new one ?`
          )
        ) {
          //confirmed so update data
          updateData(dataObject);
        } else {
          // do not want to update and not want to have duplicate so delete name and number
          resetTextField();
        }
      } else {
        // if not duplicate, create a new entry
        creatingData(dataObject);
      }
    }
  };

  const creatingData = (dataObject) => {
    console.log("this is App ceatingData, dataObject: ", dataObject);
    updateService
      .create(dataObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson)); //setPerson([...persons, returnedPerson]) spread operator also for new Array
        resetTextField();
        setSuccessMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.log(`something failed in adding the data`);
      });
  };

  const deleteData = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      updateService
        .deleteEntry(person.id) //need the id to delete the right entry
        .then((deletedPerson) => {
          // update function for state persons, find all persons without the delete ID and update the Persons array with them
          setPersons(persons.filter((n) => n.id !== person.id));
          setErrorMessage(`${person.name} was deleted`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const updateData = (dataObject) => {
    // Name is already in Persons ( duplicate is true) and want to update, find the person in persons
    const entryToUpdate = persons.find(
      (person) => person.name == dataObject.name
    );
    const updatedEntry = { ...entryToUpdate, number: dataObject.number }; // create a new updated Object (updated Entry)
    updateService
      .update(entryToUpdate.id, updatedEntry)
      .then((updatedPerson) => {
        setPersons(
          persons.map(
            (
              person // make a new array of all the not updated, and the updated and then use the state update function to update persons array
            ) => (person.id !== updatedPerson.id ? person : updatedPerson)
          )
        );
        resetTextField();
      })
      .catch((error) => {
        console.log(`something failed in updating the data`);
      });
  };

  const isDuplicate = (personName) => {
    // checking if name already exists in Persons Usestate Array
    const nameArray = persons.map((person) => person.name); // get only names in new array
    const tryNewName = nameArray.concat(personName); // never mutate state objects directly so use .concat or ... spread operator
    const checkValues = new Set(tryNewName);
    if (checkValues.size < tryNewName.length) {
      // if true, duplicate is found
      return true;
    }
  };

  const resetTextField = () => {
    setNewName("");
    setNewNumber("");
  };

  const handleNewName = (event) => {
    setNewName(event.target.value);
  };
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchName = (event) => {
    setSearchName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} isError={false} />
      <Notification message={errorMessage} isError={true} />
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <h2>Add a new</h2>
      <PersonForm
        addData={addData}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <ul>
        {matchName.map((person) => (
          <Person key={person.name} person={person} deleteData={deleteData} /> // hier nochmal gucken Key vllt als person.id is mehr unique identifier ?
        ))}
      </ul>
    </div>
  );
};

export default App;
