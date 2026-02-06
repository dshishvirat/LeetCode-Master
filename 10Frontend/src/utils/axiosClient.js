import axios from "axios"

const axiosClient =  axios.create({
   // baseURL: 'http://localhost:3000',
    baseURL: 'https://leet-code-master-frontend.vercel.app/login',
    
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;

