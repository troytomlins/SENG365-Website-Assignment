import axios from 'axios'

const SERVER_URL = 'http://localhost:4941'
const API_URL = '/api/v1'

const instance = axios.create({
    baseURL: SERVER_URL,
    timeout: 3000
});

// Endpoints
export default {

    addNewUser: (user) => instance.post(API_URL + '/users/register', {...user.data}, {withCredentials: true}),

    login: (email, password) => instance.post(API_URL + '/users/login', {email, password}, {withCredentials: true}),

    logOut: (token) => instance.post(API_URL + '/users/logout', {}, {
        headers: {
            "X-Authorization": token
            }
        }),

    searchQC: (query, categoryIds) => instance.get(API_URL + `/events?q=${query}&categoryIds=${categoryIds}`, {withCredentials:true}),

    searchQ: (query) => instance.get(API_URL + `/events?q=${query}`, {withCredentials:true}),

    searchC: (categoryIds) => instance.get(API_URL + `/events?categoryIds=${categoryIds}`, {withCredentials:true}),

    getAllEvents: () => instance.get(API_URL + '/events', {withCredentials:true}),

    getOneEvent: (eventId) => instance.get(API_URL + `/events/${eventId}`, {withCredentials:true}),

    getCategories: () => instance.get(API_URL + '/events/categories', {withCredentials:true})
}