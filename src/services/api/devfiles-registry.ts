import axios from 'axios';

const fetchDevfiles = (): Promise<{ devfiles: che.IDevfileMetaData[], registryUrl: string }> => {
    return axios.get('/api/workspace/settings').then((resp: { data: che.IWorkspaceSettings }) => {
            // TODO  remove 'https://che-devfile-registry.openshift.io'. Just for testing.
            const registryUrl = resp && resp.data && resp.data.cheWorkspaceDevfileRegistryUrl || 'https://che-devfile-registry.openshift.io';
        return axios.get(`${registryUrl}/devfiles/index.json`).then((resp: { data: che.IDevfileMetaData[] } ) => {
                const devfiles = resp.data;
                return Promise.resolve({devfiles, registryUrl});
        });
    });
};
// return new Promise<void>((resolve: IResolveFn<void>, reject: IRejectFn<void>) => {
//TODO  implement createWorkspace
//   createDevfile: { method: 'POST', url: '/api/workspace/devfile' },
//  example: https://che.openshift.io/api/workspace/devfile?attribute=stackName:Apache+Camel+K

export default fetchDevfiles;
