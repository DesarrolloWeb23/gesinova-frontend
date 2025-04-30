import { http } from './http'

//const token = localStorage.getItem("token") // O donde lo tengas guardado

//const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoxNzQ2MDI4NDE3LCJyb2xlcyI6WyJBRE1JTklTVFJBRE9SIl0sInBlcm1pc3Npb25zIjpbImNhbl9jcmVhdGVfdXNlcnMiXSwiZXhwIjoxNzQ2MDI5MDE3fQ.Eg8sxpA4kwfgOHLNQToq_hEeQxCP7Z0c-KFm2Yct2xk"

// export const authService = {
//     async login(username: string, password: string) {
//         const response = await http.post('/auth/login',  {
//             method: "POST",
//             headers: {
//             "Content-Type": "application/json",
//             //...(token && { Authorization: `Bearer ${token}` }) 
//             },
//             body: JSON.stringify({
//             username:"johndoe",
//             password:"12345dsad6",
//             confirmPassword:"123456"
//             }),
//         })
//         return response.data // Puedes ajustar esto según el backend
//     },
// }


export const loginUser =  {
    async login (username: string, password: string) {
        const response = await http.post('http://localhost:8080/auth/login', {username:username, password:password, confirmPassword: password});
        return response.data; // O la información que necesites de la respuesta
    }
};