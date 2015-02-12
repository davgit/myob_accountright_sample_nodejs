var OAuth = require('OAuth');

exports.authorized = function(req, res){
  if (req.query['error'] === 'access_denied') {
    res.redirect('/');
  }
  else {
    res.app.settings['code'] = req.query['code'];
    
    var OAuth2 = OAuth.OAuth2;
    var oauth2 = new OAuth2(res.app.settings['myob credentials'].clientId,
       res.app.settings['myob credentials'].clientSecret, 
       'https://secure.myob.com/', 
       null,
       'oauth2/v1/authorize', 
       null);
       
    var options = { 
      'grant_type':'authorization_code', 
      'scope': 'CompanyFile', 
      'redirect_uri': res.app.settings['myob credentials'].redirectUri
    };   
    
    oauth2.getOAuthAccessToken(req.query['code'], options, function (e, access_token, refresh_token, results){
      if (e===null) {
        console.log('authorized...');
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        req.session.expires = Date.now() + (1000 * results['expires_in']);
        res.redirect('/companyfiles');
      } else {
         console.log(e);
         res.send({error: e});
      }
    });
  }
};