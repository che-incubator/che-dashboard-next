import {IBranding} from '../bootstrap/che-branding'

const brandingReducer = (branding: IBranding, action: { type: string; branding: IBranding }) => {
    switch (action.type) {
        case 'SET_BRANDING':
            return action.branding;
        case 'GET_BRANDING':
            return branding;
        default:
            return {};
    }
};

export default brandingReducer;
