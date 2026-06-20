const https = require('https');
const url = 'https://student-academic-calculator.firebaseapp.com/__/auth/iframe?apiKey=AIzaSyATXELASF5hNEBJKfKIDWFd15AoiwCll0Q&appName=%5BDEFAULT%5D&v=9.23.0&eid=p&usegapi=1&jsh=m%3B%2F_%2Fscs%2Fabc-static%2F_%2Fjs%2Fk%3Dgapi.lb.en.ch0Jz-JlMrQ.O%2Fd%3D1%2Frs%3DAHpOoo_YD4KoV8fTh_kLhktsiThAm3yJ5A%2Fm%3D__features__';
https.get(url, (res) => {
  console.log('STATUS', res.statusCode);
  res.on('data', () => {});
  res.on('end', () => {
    console.log('DONE');
  });
}).on('error', (err) => {
  console.error('ERROR', err.message);
});
