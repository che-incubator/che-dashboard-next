import axios from 'axios';

const fetchDevfiles = (): Promise<Array<che.IWorkspace>> => {
    return axios.get('/api/workspace/settings').then(resp => {
        const workspaceSettings: che.IWorkspaceSettings = resp.data;
///////TODO
        return Promise.resolve(resp.data);
    });
};

export default fetchDevfiles;
