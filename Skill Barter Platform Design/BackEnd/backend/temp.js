import bcrypt from "bcryptjs";

bcrypt.compare("admin123", "$2b$10$MWaTxZDJR1wm86NIq.Fm/ulQgzhL1kWlFUMQYyw2Uhzp5LAEZFsEq")
  .then(result => console.log("Match?", result));
