import bcrypt from "bcryptjs";

// The password you want to check
const plainPassword = "Aravind_12";

// The hashed password from your database
const hashedPassword = "$2a$10$qIOmj1Xsi7SfUBz3Bh3I6enslKjtWPEBOGIqWBA36P5g/oJS0Yw5m";

async function checkPassword() {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if (isMatch) {
    console.log("Password is correct ✅");
  } else {
    console.log("Password is incorrect ❌");
  }
}

checkPassword();
