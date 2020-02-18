import axios from 'axios';

const fetchWorkspaces = (): Promise<Array<che.IWorkspace>> => {
    return axios.get('/api/workspace').then(resp => {
        return Promise.resolve(resp.data);
    });
};

export default fetchWorkspaces;
