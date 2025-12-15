import axios from './api';

export const getUsers = async () => {
    const res = await axios.get('/users');
    return res.data;
}