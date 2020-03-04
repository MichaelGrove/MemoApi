// tslint:disable:no-console

import bcrypt from "bcrypt";
import { createConnection } from "typeorm";
import { User } from "./entity/User";

const displayName = process.argv[2];
const email = process.argv[3];
const password = process.argv[4];

if (!displayName || !email || !password) {
    if (!displayName) {
        console.log("Display name is missing");
    } else if (!email) {
        console.log("Email is missing");
    } else if (!password) {
        console.log("Password is missing");
    }

    console.log('Example: npm run ts-setup "John Doe" john.doe@example.com qwerty123');
} else {
    console.log("Setup start");

    createConnection().then(async (connection) => {
        console.log("Creating user...");
        const salt = bcrypt.genSaltSync(10);
        const user = new User();
        user.displayName = displayName;
        user.email = email;
        user.password = bcrypt.hashSync(password, salt);
        user.createdAt = new Date();
        user.updatedAt = new Date();
        const repo = connection.getRepository(User);
        await repo.save(user);
        console.log("Setup complete");
        process.exit();
    });
}
