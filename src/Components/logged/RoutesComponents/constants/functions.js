
import connections from '../../../connections';
import Cookies from'js-cookie';
export const countryToFlag = (isoCode) => {
    return typeof String.fromCodePoint !== "undefined"
        ? isoCode
            .toUpperCase()
            .replace(/./g, char =>
                String.fromCodePoint(char.charCodeAt(0) + 127397)
            )
        : isoCode;
}

export const deleteRefreshToken = () => {
    const currentRefreshToken = Cookies.get("RefreshToken");
    const data = {
        RJwt: currentRefreshToken
    };
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(connections.authServer.concat("/api/user/logout"), options)
        .then(response => {
            if (response.ok) return response;
            else throw Error(response.status.toString());
        })
        .catch(error => console.error(error))
};

export const unauthorizedLogOut = () => {
    deleteRefreshToken();
    Cookies.remove("JsonWebToken");
    Cookies.remove("RefreshToken");
    Cookies.remove("pp");
    return window.location.reload();
}

export const GetRequestFunction = async (concatURL) => {
    const token = Cookies.get('RefreshToken');
    const options = {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    };
    const response = await fetch(connections.server.concat(concatURL), options);
    return response.json();
};

export const PostRequestFunction = async (concatURL, data) => {
    const token = Cookies.get('RefreshToken');
    const options = {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    const response = await fetch(connections.server.concat(concatURL), options);
    return response.json();
};