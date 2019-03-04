const service = async (url, method, data) => {
    const options = {
        method: method || 'get'
    };

    const request = await fetch(url, options);
    const body = await request.json();

    return body;
};

export default service;
