export function checkPassword(password) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: '/users/checkPassword',
            contentType: 'application/json',
            data: JSON.stringify({password}),
            processData: false,
            statusCode: {
                200: () => Em.run(null, resolve),
                500: () => Em.run(null, reject)
            }
        });
    });
}

/*export default function ajax() {
    return true;
}*/
