import axios from 'axios'

const LOCAL = 'http://localhost:4941'
//const SERVER_URL = 'http://csse-s365docker1.canterbury.ac.nz:4246'
const API_URL = '/api/v1'

const instance = axios.create({
    baseURL: LOCAL,
    timeout: 3000
});

// Endpoints
export default {

    // User
    addNewUser: (user) => instance.post(API_URL + '/users/register', {...user.data}, {}),

    getUser: (userId, token) => instance.get(API_URL + `/users/${userId}`, {
        headers: {
            "X-Authorization": token
        }
    }),

    updateUser: (userId, data, token) => instance.patch(API_URL + `/users/${userId}`, data, {
        headers: {
            "X-Authorization": token
        }
    }),

    // User Images
    setUserImage: (userId, image, imageType, token) => instance.put(API_URL + `/users/${userId}/image`, image, {
        headers: {
            "X-Authorization": token,
            "Content-Type": imageType
        },
    }),

    getUserImage: (userId) => instance.get(API_URL + `/users/${userId}/image`, {
        responseType: 'arraybuffer'
    }),

    deleteUserImage: (userId, token) => instance.delete(API_URL + `/users/${userId}/image`, {
        headers: {
            "X-Authorization": token
        }
    }),

    // Log In/Out
    login: (email, password) => instance.post(API_URL + '/users/login', {email, password}, {}),

    logOut: (token) => instance.post(API_URL + '/users/logout', {}, {
        headers: {
            "X-Authorization": token
            }
        }),

    // Events
    search: (searchQuery) => instance.get(API_URL + `/events?${searchQuery}`, {}),

    getOneEvent: (eventId, token) => instance.get(API_URL + `/events/${eventId}`, {
        headers: {
            "X-Authorization": token
        }
    }),

    addNewEvent: (data, token) => instance.post(API_URL + '/events', data, {
        headers: {
            "X-Authorization": token
        }
    }),

    deleteEvent: (eventId, token) => instance.delete(API_URL + `/events/${eventId}`, {
        headers: {
            "X-Authorization": token
        }
    }),

    editEvent: (data, eventId, token) => instance.patch(API_URL + `/events/${eventId}`, data,{
        headers: {
            "X-Authorization": token
        }
    }),


    getAttendees: (eventId, token) => instance.get(API_URL + `/events/${eventId}/attendees`, {
        headers: {
            "X-Authorization": token
        }
    }),

    changeAttendance: (userId, eventId, status, token) => instance.patch(API_URL + `/events/${eventId}/attendees/${userId}`,
        {status}, {
            headers: {
                "X-Authorization": token
            }
        }),

    joinEvent: (eventId, token) => instance.post(API_URL + `/events/${eventId}/attendees`, {}, {
        headers: {
            "X-Authorization": token
        }
    }),

    leaveEvent: (eventId, token) => instance.delete(API_URL + `/events/${eventId}/attendees`, {
        headers: {
            "X-Authorization": token
        }
    }),

    // Event Categories
    getCategories: () => instance.get(API_URL + '/events/categories', {}),

    // Event Image
    setEventImage: (eventId, image, imageType, token) => instance.put(API_URL + `/events/${eventId}/image`, image, {
        headers: {
            "X-Authorization": token,
            "Content-Type": imageType
        },

    }),
    getEventImage: (eventId) => instance.get(API_URL + `/events/${eventId}/image`, {
            responseType: 'arraybuffer'
    })
}
