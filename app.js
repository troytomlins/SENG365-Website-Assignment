
const { createApp } = Vue;

const app = new createApp({

});

app.config.globalProperties.axios = axios;
app.mount('#app');