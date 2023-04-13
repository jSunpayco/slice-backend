const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const PORT = 8080

app.use(require('./routes/index'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});