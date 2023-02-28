import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
const token = document.cookie.replace(/(?:(?:^|.*;\s*)qianToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
// console.log(token);
axios.defaults.headers.common['Authorization'] = token;

createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            axios.post(api, this.user)
                .then((response) => {
                    // console.log(response.data);
                    const { token, expired } = response.data;
                    // console.log(token, expired);  
                    // 將 token 存入 cookie
                    document.cookie = `qianToken=${token}; expires=${new Date(expired)}`;
                    window.location = 'products.html';
                })
                .catch((error) => {
                    alert(error.data.message);
                });
        },
    },
}).mount('#app');