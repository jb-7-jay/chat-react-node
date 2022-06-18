export const host = "http://localhost:5050";
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;

export const getAllGroupsUser = `${host}/api/messages/group`;
export const getAllGroupsMessages = `${host}/api/messages/group/msg`;
export const sendGroupMessage = `${host}/api/messages/group/send`;
