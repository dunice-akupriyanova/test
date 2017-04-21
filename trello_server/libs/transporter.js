const nodemailer = require('nodemailer');

module.exports = function() {
    let transporter = nodemailer.createTransport({
        service: 'Mail.ru',
        auth: {
            user: 'trello.server@mail.ru',
            pass: 't19283746'
        }
    });
    return {
        sendMail: function(mailOptions) {
            return new Promise(function(resolve, reject) {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(info);
                });
            });
        }
    };
};