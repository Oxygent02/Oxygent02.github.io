var webPush = require('web-push');
var pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/ft-i_4xKNVY:APA91bHpwuJUfVz2dt62081YdcpZ6ROXdZc8BuGZChbIT6_FGQuT-uVZcH7-VRBl5Z__7u44yryDhqW4FMXJZZ3FYO_Z_WZ1EcX85vpIopN3His-pkR-5pPICCdxbib-hMIvFWGxHn3W",
    "keys": {
        "p256dh": "BOdEo2Rv3hAukfUe7pdJ3cYm1eYjYh8arOeVeg5MRO0Z6FZr5kfovzSKq6f3r3jtAcDHCQ5x9V8v3mmZdaddgIA=",
        "auth": "lGubvH8Kfvazjwy6OEbR6g=="
    }
};
var payload = 'test notif dari server';
var options = {
    gcmAPIKey: 'AAAA0z_MHbk:APA91bEWVAAR84C3wNWjAHKiPRE7IdP84YMxFbbSdo6-RtAd2T6y9HTzZRz1VhLQPV8orPZYumErocNfLOcEQbUhPUxlmhhIWKKSOS5uvOyPG7DpjCxf2IrbpBz0neAQYQUU4DO-VGr_',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);
