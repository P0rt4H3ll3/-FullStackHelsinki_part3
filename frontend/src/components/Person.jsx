const Person = ({ person, deleteData }) => {
  return (
    <p>
      {person.name} {person.number}{" "}
      <button onClick={() => deleteData(person)}>delete</button>
    </p>
  );
};

export default Person;
