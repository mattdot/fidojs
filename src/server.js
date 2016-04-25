"use strict";

var express = require('express');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var passport = require('./passport');

var app = express();
var port = process.env.PORT || 3000;

//in memory database ... store your data in a real place :)
var inmemdb = {
    users : { 
        "alice" : { 
            password : bcrypt.hashSync('$ecret'), 
            public_keys : [] 
            },
        "bob" : { 
            password : bcrypt.hashSync('$ecret'), 
            public_keys : [] 
            } 
        },
    sessions : {},
    challenges : {}
};

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/authorize/password', function(req, res){
    
});

app.post('/authorize/fido', function(req, res) {
    
});

app.get('/authorize/fido/challenge', function(req, res) {
  //generate a new challenge
  var c = passport.challenge();
  
  //save challenge with 5 minute expiration
  var expires = new Date(new Date().getTime() + 5*60000); 
  inmemdb.challenges[c] = expires;
  
  res.send({ challenge: c });
});

app.put('/user/register', function(req, res) {
    
});

app.put('/user/enroll', function(req,res) {
    
});

/*
app.put('/verify', function(req, res){
  var pk = "MIIBCgKCAQEAmhMAMfDs+NfPiulDJesF27sglc9QQYemqgeXiO1APtSeCPUszdAM/zqpP02yw6HKRFWsJbRFu3NXd6F6B8ioyqsJF9wmShZjc9AN1sDQ9Kh5YbiZzfFdZiX4qkeOdVRzJ2FwSlrnMzeathDd3+vJsAgv6Tj4cwMZZ26zcyrRO0lpwrQJ7fTdqoBtUwoIeX/XvVvlfZOFmAv3brfBei5VPJhlH5K86m/8OgyGKTszgpmotfJRuzI5ugoaiRi1Ug2PWgqziIxevvs+QAyBBUsqjNfPa4I1Fgh4p6MZkuqS+80VKxKIWXjr80jwxPEQXBW+/pMGPFiJ/3naJ/ykefpktQIDAQAB";
  var sign = "EScbTvFNyWNccMmR/XhHB7FkPnWl4bFpV1/Kt5Nj+rVzu/G2z5707G+R5VnrN+ZikGNssi8zKievFIq0wr7JsJuSBR8dOPFZG9gffYwfcva3KTh41bvt7XYfn6v5AwbT9fHxwGvcg+XwYPMEpFuFq1XVwBor5UoDXicrjAzNOMCwugflUFkbEZqtfRe+C/kvrrsAxz0c/WLMhosTNgaDPWFc6lqgOhTTgdxlF51WF33bpxv2ethlDr4DAy4vf2dpVKIuYPjtAJsHtgOPGTjiutEqiPW1Exl0G+N0hW9RHQfQRCFBqntvFUqkJWGbrsL3qPJ8rl/2M2LT0SJG2tgqfg==";
  var challenge = "KCnU9WolQaD2tGRxHCGLDOpyzJU9k0xPON/E0mEUMXU=";
});
*/

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});