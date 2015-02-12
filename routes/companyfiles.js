var https = require('https');

exports.list = function(req, res){
    
  var options = {
    host: 'api.myob.com',
    port: 443,
    path: '/accountright/',
    method : 'GET',
    headers : { 
      'Authorization' : 'Bearer ' + req.session.access_token, 
      'x-myobapi-key' : res.app.settings['myob credentials'].clientId, 
      'Content-Type'  : 'application/json' 
    }
  };
    
  request = https.request(options, function(response) {
    var buffer = '';
    response.on('data', function (data) {
      buffer += data;
    });

    response.on('end', function () {
      res.render('companyfiles', { 
        title: 'Here are your AccountRight company files',
        pagetitle: 'MYOB API NodeJS Sample',
        data: JSON.parse(buffer)
      });
    });
        
  });
  request.end();
  request.on('error', function(e) {
    res.send({error:e});
  });
};