"use strict";

var pk = "MIIBCgKCAQEAmhMAMfDs+NfPiulDJesF27sglc9QQYemqgeXiO1APtSeCPUszdAM/zqpP02yw6HKRFWsJbRFu3NXd6F6B8ioyqsJF9wmShZjc9AN1sDQ9Kh5YbiZzfFdZiX4qkeOdVRzJ2FwSlrnMzeathDd3+vJsAgv6Tj4cwMZZ26zcyrRO0lpwrQJ7fTdqoBtUwoIeX/XvVvlfZOFmAv3brfBei5VPJhlH5K86m/8OgyGKTszgpmotfJRuzI5ugoaiRi1Ug2PWgqziIxevvs+QAyBBUsqjNfPa4I1Fgh4p6MZkuqS+80VKxKIWXjr80jwxPEQXBW+/pMGPFiJ/3naJ/ykefpktQIDAQAB";

var ASN1_ID_SEQUENCE = 0x30;
var ASN1_ID_OBJECTID = 0x06;
var ASN1_ID_INTEGER = 0x02;

var ASN1_DEF_DEFINITE = 0x80;
var ASN1_DEF_INDEFINITE = 0x00;

function nsizeof(num) {
	if(typeof(num) !== "number") {
		return NaN;
	}

	return Math.ceil(Math.log(num)/Math.log(255));
}

function Asn1Value(identifier, contents, indefinite) {
	indefinite = typeof(indefinite) !== "undefined" ? indefinite : false;
	var contentType = typeof(contents);
	var contentBuffer;
	if(contentType === "function") {
		contentBuffer = contents();
		if(!Buffer.isBuffer(contentBuffer)) {
			throw new Error("contents function must return a Buffer");
		}
	} else if(contentType == "string") {
		contentBuffer = new Buffer(contents, "base64");
		console.log("ddd=" + contentBuffer.toString("hex"));
	} else if(Buffer.isBuffer(contents)) {
		contentBuffer = contents;
	} else {
		throw new Error("contents must be a function or a base64 encoded string");
	}
	
	// -------------------------------------------------------------------------------
	// | Identifier Octets | Length Octets | Contents Octets | End Octets (optional) |
	// -------------------------------------------------------------------------------
	
	var contentLength = contentBuffer.length;
	var headLength = nsizeof(contentLength);
	var defineLength = indefinite ? 2 : 1;
	var outputBuffer = new Buffer(1 + headLength + contentLength + defineLength);
	outputBuffer.fill(0);
	var index = 0;
	
	//identifier octet
	outputBuffer.writeUInt8(identifier, index++);
	
	//length octets
	if(indefinite) {
		outputBuffer.writeUInt8(contentLength, index++);
	}
	else {
		outputBuffer.writeUInt8(ASN1_DEF_DEFINITE | headLength, index++);
		for(var j=headLength-1; j>=0; j--) {
			var shifted = (contentLength >> (j*8)) & 0xFF;
			outputBuffer.writeUInt8(shifted, index++);
		}
	}
	
	console.log("content length" + contentLength);
	
	//contents octets
	contentBuffer.copy(outputBuffer, index, contentLength);
	index += contentLength;
	
	//end octets
	if(indefinite) {
		b.writeUInt8(0x05, index++); //NULL
		b.writeUInt8(0x00, index++); //size = 0
	}
	
	return outputBuffer;
}

// var test = Asn1Value(ASN1_ID_SEQUENCE, new Buffer("hello world, how are you"));
// console.log(test.toString("base64"));
// console.log(test.toString("hex"));
// console.log("========");
var test = Asn1Value(ASN1_ID_SEQUENCE, () => {
	return Asn1Value(ASN1_ID_INTEGER, pk);
});
console.log(test.toString("base64"));
console.log(test.toString("hex"));

// var keysize = 256;
// var b = new Buffer(keysize+38);
// var i = 0;
// b.fill(0);
// 
// b.writeUInt8(0x30, i++); //SEQUENCE
// b.writeUInt8(0x82, i++); 
// b.writeUInt16BE(290, i); i+=2; //total size
// 
// b.writeUInt8(0x30, i++); //SEQUENCE
// b.writeUInt8(0x0D, i++); //size = 13
// 
// b.writeUInt8(0x06, i++); //OBJECT ID
// b.writeUInt8(0x09, i++); //size = 9
// 
// //1.2.840.113549.1.1.1
// b.writeUInt32BE(0x2A864886, i); i+=4; 
// b.writeUInt32BE(0xF70D0101, i); i+=4; 
// b.writeUInt8(0x00, i++);
// 
// b.writeUInt8(0x05, i++); //NULL
// b.writeUInt8(0x00, i++); //size = 0
// 
// b.writeUInt8(0x03, i++); //BIT STRING
// b.writeUInt8(0x82, i++);
// b.writeUInt16BE(0xFFFF, i); i+=2; //total size
// b.writeUInt8(0x00, i++); //size = 0
// 
// b.writeUInt8(0x30, i++); //SEQUENCE
// b.writeUInt8(0x82, i++); 
// b.writeUInt16BE(0xFFFF, i); i+=2; //total size
// 
// b.writeUInt8(0x02, i++); //INTEGER
// b.writeUInt8(0x82, i++);
// b.writeUInt16BE(keysize+1, i++); //pub size
// b.writeUInt8(0x00, i++);
// 
// //write key
// b.write(pk,i, keysize, 'base64');
// i += keysize;
// 
// b.writeUInt8(0x02, i++); //INTEGER
// b.writeUInt8(0x03, i++); //len=3
// 
// //65537
// b.writeUInt8(0x01, i++);  
// b.writeUInt8(0x00, i++);  
// b.writeUInt8(0x01, i++);  
// 
// console.log("==========");
// console.log(b.toString('hex'));
// 
// console.log("-----BEGIN PUBLIC KEY-----\n" 
// 	+ b.toString('base64')
// 	+ "\n-----END PUBLIC KEY-----"
// 	);