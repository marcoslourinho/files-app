import {create} from 'apisauce';

const api  = create({
    baseURL: 'https://coruja-58384.firebaseio.com',
});

api.addResponseTransform(response => {
	if (!response.ok) throw response;
});

export default api;