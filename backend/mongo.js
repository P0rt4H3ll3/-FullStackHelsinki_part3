const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log(
    'please input the name as \'firstname lastname\' followed by the number '
  )
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://portahelle99:${password}@cluster0.uk4drsu.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    console.log('Phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  console.log(
    `new person to add name: ${process.argv[3]} number: ${process.argv[4]}`
  )
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(() => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    )
    mongoose.connection.close()
  })
}
