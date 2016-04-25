var crypto = require('crypto');
var fs = require("fs"); 
var stream = require("stream");

//var pk = "MIIBCgKCAQEAmhMAMfDs+NfPiulDJesF27sglc9QQYemqgeXiO1APtSeCPUszdAM/zqpP02yw6HKRFWsJbRFu3NXd6F6B8ioyqsJF9wmShZjc9AN1sDQ9Kh5YbiZzfFdZiX4qkeOdVRzJ2FwSlrnMzeathDd3+vJsAgv6Tj4cwMZZ26zcyrRO0lpwrQJ7fTdqoBtUwoIeX/XvVvlfZOFmAv3brfBei5VPJhlH5K86m/8OgyGKTszgpmotfJRuzI5ugoaiRi1Ug2PWgqziIxevvs+QAyBBUsqjNfPa4I1Fgh4p6MZkuqS+80VKxKIWXjr80jwxPEQXBW+/pMGPFiJ/3naJ/ykefpktQIDAQAB";
//var sign = "EScbTvFNyWNccMmR/XhHB7FkPnWl4bFpV1/Kt5Nj+rVzu/G2z5707G+R5VnrN+ZikGNssi8zKievFIq0wr7JsJuSBR8dOPFZG9gffYwfcva3KTh41bvt7XYfn6v5AwbT9fHxwGvcg+XwYPMEpFuFq1XVwBor5UoDXicrjAzNOMCwugflUFkbEZqtfRe+C/kvrrsAxz0c/WLMhosTNgaDPWFc6lqgOhTTgdxlF51WF33bpxv2ethlDr4DAy4vf2dpVKIuYPjtAJsHtgOPGTjiutEqiPW1Exl0G+N0hW9RHQfQRCFBqntvFUqkJWGbrsL3qPJ8rl/2M2LT0SJG2tgqfg==";
//var challenge = "KCnU9WolQaD2tGRxHCGLDOpyzJU9k0xPON/E0mEUMXU=";

//var publicKey  = fs.readFileSync("pub.key", "utf8");  

//publicKey = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMYfnvWtC8Id5bPKae5yXSxQTt\n+Zpul6AnnZWfI2TtIarvjHBFUtXRo96y7hoL4VWOPKGCsRqMFDkrbeUjRrx8iL91\n4/srnyf6sh9c8Zk04xEOpK1ypvBz+Ks4uZObtjnnitf0NBGdjMKxveTq+VE7BWUI\nyQjtQ8mbDOsiLLvh7wIDAQAB\n-----END PUBLIC KEY-----";

// var s = new stream.Readable();
// s.push(publicKey);
// s.push(null);
// var pkbuf = new Buffer(publicKey, "ascii");

exports.verify = function(pk, challenge, signature) {
    var pem = "-----BEGIN RSA PUBLIC KEY-----\n" 
        + pk.replace(/(.{64})/g, "$1\n")
        + "\n-----END RSA PUBLIC KEY-----";
    console.log(pem);

    var rsa = crypto.createVerify("RSA-SHA256");
    rsa.update(new Buffer(challenge, "base64"));
    if(rsa.verify(pem, signature, "base64"))
    {
        console.log('verified');
        return { result : true };
    }
    else {
        console.log('call the cops');
        return { result : false };
    }
};

exports.challenge = function() {
    var nonce_size = 32;
  
    var mac = crypto.createHash('sha256');
    var nonce = crypto.randomBytes(nonce_size);
    mac.update(nonce);
    mac.update(Date.now().toString());
    
    return mac.digest('base64');  
};