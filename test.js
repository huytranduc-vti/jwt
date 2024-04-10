import bcrypt from "bcrypt";

// Password to hash
const password = "12345678";

// Hash the password
bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("Hashed password:", hashedPassword);

  // Now let's compare the hashed password with the original password
  const enteredPassword = "12345678";
  bcrypt.compare(enteredPassword, hashedPassword, (err, result) => {
    if (err) {
      console.error("Error comparing passwords:", err);
      return;
    }
    if (result) {
      console.log("Password matches the hashed password.");
    } else {
      console.log("Password does not match the hashed password.");
    }
  });
});
