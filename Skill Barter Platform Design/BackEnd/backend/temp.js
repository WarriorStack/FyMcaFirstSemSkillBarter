import bcrypt from "bcryptjs";

bcrypt.compare("123456", "$2b$10$CflkjJAZYXdfHVD3Ga4ete3W0AEmOYmFLXejgFGGQVTWERHhG3N5m")
  .then(result => console.log("Match?", result));

// import bcrypt from "bcrypt";

// const hash = await bcrypt.hash("123456", 10);
// console.log(hash);
