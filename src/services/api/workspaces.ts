import axios from 'axios';

declare const require: Function;
const {load} = require('js-yaml');

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

export const deleteWorkspace = (workspaceId: string): Promise<che.IWorkspace> => {
    return axios.delete(`/api/workspace/${workspaceId}`).then(resp => {
        return Promise.resolve(resp.data);
    });
};

export const createWorkspace = (devfileUrl: string, attr: { [param: string]: string }): Promise<che.IWorkspace | {}> => {
    return axios.get(devfileUrl).then(resp => {
        return axios({
            method: 'post',
            url: `/api/workspace/devfile`,
            data: load(resp.data),
            params: {attribute: `stackName:${attr.stackName}`}
        }).then(resp => {
            return Promise.resolve(resp.data);
        });
    });
};
