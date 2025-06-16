export const apiUrlAdmin = 'http://localhost:8000/api/admin';
export const apiUrlFront = 'http://localhost:8000/api/front';
export const apiUrlFile = 'http://localhost:8000';

export const adminToken = () => {
    const data = JSON.parse(localStorage.getItem('adminInfo'));
    return data.token;
}