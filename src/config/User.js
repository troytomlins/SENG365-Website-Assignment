export default class User{

    // This is a config for the user requirement details
    static config = {
        firstName: {
            name: "First name",
            minLength: 2,
            maxLength: 255,
            regexMessage: "Must be alphanumeric (spaces, -, ' optional)",
            regex: /^[a-zA-Z '-]+$/
        },
        lastName: {
            name: "Last name",
            minLength: 2,
            maxLength: 255,
            regexMessage: "Must be alphanumeric (spaces, -, ' optional)",
            regex: /^[a-zA-Z '-]+$/
        },
        email: {
            name: "Email",
            minLength: 5,
            maxLength: 30,
            regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            regexMessage: "Invalid email. Expected format is example123@gmail.com."

        },
        password: {
            name: "Password",
            minLength: 8,
            maxLength: 30,
            regexMessage: "Invalid password format. Password length must be between 8 - 30"
        }
    };

    constructor({firstName, lastName, email, password}) {
        this.data = {
            firstName,
            lastName,
            email,
            password
        }

    }

}
