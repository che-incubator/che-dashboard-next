const workspacesReducer = (workspaces: Array<che.IWorkspace> = [], action: { type: string; workspaces: Array<che.IWorkspace> }) => {
    switch (action.type) {
        case 'SET_WORKSPACES':
            return action.workspaces;
        case 'GET_WORKSPACES':
            return workspaces;
        default:
            return [];
    }
};

export default workspacesReducer;
