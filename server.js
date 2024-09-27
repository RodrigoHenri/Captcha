const express = require('express');
const svgCaptcha = require('svg-captcha');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3003;


app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));


app.use(express.urlencoded({ extended: true }));


app.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({
        size: 6,
        noise: 3,
        color: true,
        background: '#f4f4f4',
        ignoreChars: '0o1i',
        width: 150,
        height: 50,
        fontSize: 50,
    });

    req.session.captcha = captcha.text;

    res.type('svg');
    res.status(200).send(captcha.data);
});


app.post('/verify', (req, res) => {
    const userCaptcha = req.body.captcha;
    const captcha = req.session.captcha;

    if (userCaptcha === captcha) {
        res.send('Captcha correto!');
    } else {
        res.send('Captcha incorreto, tente novamente.');
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
