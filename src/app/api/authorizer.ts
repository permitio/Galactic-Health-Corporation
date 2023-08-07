import { Permit } from 'permitio';

const permit = new Permit({
    token: process.env.PERMIT_SDK_KEY,
    pdp: process.env.PERMIT_PDP_URL
});

export { permit };