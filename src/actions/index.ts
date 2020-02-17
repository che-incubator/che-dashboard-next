import {IBranding} from '../bootstrap/che-branding'

export const setWorkspaces = (workspaces: Array<che.IWorkspace>) => {
    return {
        type: 'SET_WORKSPACES',
        workspaces: workspaces
    }
};

export const getWorkspaces = () => {
    return {
        type: 'GET_WORKSPACES'
    }
};

export const setBranding = (branding: IBranding) => {
    return {
        type: 'SET_BRANDING',
        branding: branding
    }
};

export const getBranding = () => {
    return {
        type: 'GET_BRANDING'
    }
};
