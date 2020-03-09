import axios from 'axios';

export const fetchWorkspaces = (): Promise<Array<che.IWorkspace>> => {
    return axios.get('/api/workspace').then(resp => {
        return Promise.resolve(resp.data);
    });
};

export const startWorkspace = (workspaceId: string): Promise<che.IWorkspace> => {
    return axios.post(`/api/workspace/${workspaceId}/runtime`).then(resp => {
        return Promise.resolve(resp.data);
    });
};

export const stopWorkspace = (workspaceId: string): Promise<che.IWorkspace> => {
    return axios.delete(`/api/workspace/${workspaceId}/runtime`).then(resp => {
        return Promise.resolve(resp.data);
    });
};

