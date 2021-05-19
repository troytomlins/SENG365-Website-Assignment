import axios from 'axios'

const SERVER_URL = 'http://seng365-apitest.csse.canterbury.ac.nz:4001'

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 3000
});

export class User{

}

// Endpoints
export default {

    addNewUser: (user) => instance.post('/user/register', {...user.data}, {withCredentials: true}),

    login: (email, password) => instance.post('/users/login', {email, password}, {withCredentials: true})


}