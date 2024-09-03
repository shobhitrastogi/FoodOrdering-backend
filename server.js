import app from "./app.js";  // Importing the app

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
