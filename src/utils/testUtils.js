// utils/testUtils.js
import dotenv from "dotenv";
dotenv.config();

import { generateToken, verifyToken } from "./generateToken.js"; // adjust path if needed
import { hashPassword, comparePassword } from "./passwordUtils.js";
import { isValidEmail, isStrongPassword } from "./validators.js";
import { sendEmail } from "./emailService.js";

// 🔹 Test JWT
const testJWT = () => {
    console.log("\n--- Testing JWT ---");
    const payload = { id: "user123", email: "test@example.com" };
    const token = generateToken(payload, "1h");
    console.log("Generated Token:", token);

    const decoded = verifyToken(token);
    console.log("Decoded Token:", decoded);
};

// 🔹 Test bcrypt
const testBcrypt = async () => {
    console.log("\n--- Testing Bcrypt ---");
    const password = "Abc123!";
    const hashed = await hashPassword(password);
    console.log("Hashed Password:", hashed);

    const match = await comparePassword(password, hashed);
    console.log("Password Match:", match);
};

// 🔹 Test Email
const testEmail = async () => {
    console.log("\n--- Testing Email ---");
    try {
        await sendEmail(
            "aditi230206@gmail.com",
            "Test Email from BrainDump",
            "This is a plain text body",
            "<b>This is an HTML body</b>"
        );
        console.log("Email sent successfully!");
    } catch (err) {
        console.error("Email test failed:", err.message);
    }
};

// 🔹 Test Validators
const testValidators = () => {
    console.log("\n--- Testing Validators ---");

    const email = "test@example.com";
    console.log(email, "is valid?", isValidEmail(email));

    const passwords = ["abc", "Abc123", "Abc123!", "password", "ABC123!"];
    passwords.forEach((pw) => {
        const  valid = isStrongPassword(pw);
        console.log(`Password: ${pw} | Valid: ${valid}`);
    });
};

// 🔹 Run all tests
const runTests = async () => {
    testJWT();
    await testBcrypt();
    await testEmail();
    testValidators();
};

runTests();