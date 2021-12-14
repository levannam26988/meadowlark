var nodemailer = require('nodemailer');

module.exports = function (credentials) {
    var mailTransport = nodemailer.createTransport({
        host: credentials.nodemailer.host,
        secure: credentials.nodemailer.secure,
        port: credentials.nodemailer.port,
        auth: {
            user: credentials.nodemailer.auth.user,
            pass: credentials.nodemailer.auth.pass,
        },
    });
    var from = '"Meadowlark Travel" <levannam26988@outlook.com>';
    var errorRecipient = 'levannam26988@gmail.com';
    return {
        send: function (to, subj, body) {
            mailTransport.sendMail({
                from: from,
                to: to,
                subject: subj,
                html: body,
                generateTextFromHtml: true
            }, function (err) {
                if (err) console.error('Unable to send email: ' + err);
            });
        },

        emailError: function (message, filename, exception) {
            var body = '<h1>Meadowlark Travel Site Error</h1>' +
                'message:<br><pre>' + message + '</pre><br>';
            if (exception) body += 'exception:<br><pre>' + exception
                + '</pre><br>';
            if (filename) body += 'filename:<br><pre>' + filename
                + '</pre><br>';
            mailTransport.sendMail({
                from: from,
                to: errorRecipient,
                subject: 'Meadowlark Travel Site Error',
                html: body,
                generateTextFromHtml: true
            }, function (err) {
                if (err) console.error('Unable to send email: ' + err);
            });
        },
    }
}