const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('WE ARE CONNECTED!'));

const tourschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a Name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'Please enter a Price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model('Tour', tourschema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  price: 999,
  rating: 4.7,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => console.log(err));

const app = require('./app');

const port = process.env.PORT || 3000;
// console.log(process.env);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${port}`);
});
