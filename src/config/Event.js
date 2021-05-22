export default class Event{

    // This is a config for the user requirement details
    static config = {
        title: {
            name: "title",
            minLength: 2,
            maxLength: 255,
            regexMessage: "Must be alphanumeric (spaces, -, ' optional)",
            regex: /^[a-zA-Z '-]+$/
        },
        description: {
            name: "description",
            minLength: 2,
            maxLength: 255,
            regexMessage: "Must be alphanumeric (spaces, -, ' optional)",
            regex: /^[a-zA-Z '-]+$/
        },
        venue: {
            name: "venue",
            minLength: 2,
            maxLength: 255,
            regexMessage: "Must be alphanumeric (spaces, -, ' optional)",
            regex: /^[a-zA-Z '-]+$/
        },
        capacity: {
            name: "capacity",
            minLength: 0,
            maxLength: 7,
            regexMessage: "Must be a number",
            regex: /^[0-9]+$/
        },
        fee: {
            name: "fee",
            minLength: 0,
            maxLength: 7,
            regexMessage: "Must be a valid price",
            regex: /[(0-9)+.?(0-9)*]+/
        }
    };

}