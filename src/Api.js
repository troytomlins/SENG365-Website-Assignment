import axios from 'axios'

const SERVER_URL = 'http://csse-s365docker1.canterbury.ac.nz:4246/api/v1'

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 3000
});

// Endpoints
export default {

    addNewUser: (user) => instance.post('/users/register', {...user.data}, {withCredentials: true}),

    login: (email, password) => instance.post('/users/login', {email, password}, {withCredentials: true})


}