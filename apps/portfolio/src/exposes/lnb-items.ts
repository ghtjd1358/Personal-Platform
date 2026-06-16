import { REMOTE_LINK_PREFIX } from '@sonhoseong/mfa-lib';

export const pathPrefix = REMOTE_LINK_PREFIX.portfolio;

const guestList = [
    { id: 'portfolio-home', title: '포트폴리오', path: pathPrefix },
];

const authList = [
    { id: 'portfolio-home', title: '포트폴리오', path: pathPrefix },
];

export const lnbItems = {
    hasPrefixList: guestList,
    hasPrefixAuthList: authList,
};

export default lnbItems;
