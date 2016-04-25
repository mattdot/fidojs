"use strict";

var ASN1_ID_INTEGER = 0x02;
var ASN1_ID_BITSTRING = 0x03;
var ASN1_ID_OCTETSTRING = 0x04;
var ASN1_ID_NULL = 0x05;
var ASN1_ID_OBJECTID = 0x06;
var ASN1_ID_SEQUENCE = 0x30;

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
	
	if(contentType === "object") {
		if(Buffer.isBuffer(contents)) {
			contentBuffer = contents;	
		}
		else if(Array.isArray(contents)) {
			contentBuffer = Buffer.concat(contents);
		}
		else {
			throw new Error("contents must be a buffer, or array of buffers")
		}
	} else {
		throw new Error("contents must be a buffer, or array of buffers");
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
	
	//contents octets
	contentBuffer.copy(outputBuffer, index);
	index += contentLength;
	
	//end octets
	if(indefinite) {
		outputBuffer.writeUInt8(ASN1_ID_NULL, index++); //NULL
		outputBuffer.writeUInt8(0x00, index++); //size = 0
	}
	//console.log("output=" + outputBuffer.toString("hex"));
	return outputBuffer;
}

var pk = "MIIBCgKCAQEAmhMAMfDs+NfPiulDJesF27sglc9QQYemqgeXiO1APtSeCPUszdAM/zqpP02yw6HKRFWsJbRFu3NXd6F6B8ioyqsJF9wmShZjc9AN1sDQ9Kh5YbiZzfFdZiX4qkeOdVRzJ2FwSlrnMzeathDd3+vJsAgv6Tj4cwMZZ26zcyrRO0lpwrQJ7fTdqoBtUwoIeX/XvVvlfZOFmAv3brfBei5VPJhlH5K86m/8OgyGKTszgpmotfJRuzI5ugoaiRi1Ug2PWgqziIxevvs+QAyBBUsqjNfPa4I1Fgh4p6MZkuqS+80VKxKIWXjr80jwxPEQXBW+/pMGPFiJ/3naJ/ykefpktQIDAQAB";
var pkh = [0x00 ,0xCC ,0x61 ,0xF9,0xEF ,0x5A ,0xD0 ,0xBC ,0x21 ,0xDE ,0x5B 
,0x3C  ,0xA6 ,0x9E ,0xE7 ,0x25 ,0xD2 ,0xC5 ,0x04 ,0xED 
,0xF9 ,0x9A ,0x6E ,0x97 ,0xA0 ,0x27 ,0x9D ,0x95  ,0x9F ,0x23 ,0x64 ,0xED ,0x21 ,0xAA ,0xEF ,0x8C
,0x70 ,0x45 ,0x52 ,0xD5 ,0xD1 ,0xA3 ,0xDE ,0xB2  ,0xEE ,0x1A ,0x0B ,0xE1 ,0x55 ,0x8E ,0x3C ,0xA1
,0x82 ,0xB1 ,0x1A ,0x8C ,0x14 ,0x39 ,0x2B ,0x6D  ,0xE5 ,0x23 ,0x46 ,0xBC ,0x7C ,0x88 ,0xBF ,0x75
,0xE3 ,0xFB ,0x2B ,0x9F ,0x27 ,0xFA ,0xB2 ,0x1F  ,0x5C ,0xF1 ,0x99 ,0x34 ,0xE3 ,0x11 ,0x0E ,0xA4
,0xAD ,0x72 ,0xA6 ,0xF0 ,0x73 ,0xF8 ,0xAB ,0x38  ,0xB9 ,0x93 ,0x9B ,0xB6 ,0x39 ,0xE7 ,0x8A ,0xD7
,0xF4 ,0x34 ,0x11 ,0x9D ,0x8C ,0xC2 ,0xB1 ,0xBD  ,0xE4 ,0xEA ,0xF9 ,0x51 ,0x3B ,0x05 ,0x65 ,0x08
,0xC9 ,0x08 ,0xED ,0x43 ,0xC9 ,0x9B ,0x0C ,0xEB  ,0x22 ,0x2C ,0xBB ,0xE1 ,0xEF];

// var test = Asn1Value(ASN1_ID_SEQUENCE, new Buffer("hello world, how are you"));
// console.log(test.toString("base64"));
// console.log(test.toString("hex"));
// console.log("========");
var test = 
		Asn1Value(ASN1_ID_SEQUENCE, [
			Asn1Value(ASN1_ID_SEQUENCE, 
				Asn1Value(ASN1_ID_OBJECTID, new Buffer([0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x01]), true)
			),
			Asn1Value(ASN1_ID_BITSTRING, [ new Buffer([0x00]), 
				Asn1Value(ASN1_ID_SEQUENCE, [
					Asn1Value(ASN1_ID_INTEGER, new Buffer(pkh)),
					Asn1Value(ASN1_ID_INTEGER, new Buffer([0x01,0x00,0x01]))
				])
			])
		]);
console.log(test.toString("base64"));
console.log(test.toString("hex"));
console.log({
    sequence : [
        { objectid : new Buffer (0x00) },
    ],
    bitstring : {
        sequence : [
            { integer : new Buffer([0x00])},
            { integer : new Buffer([0x01])} 
        ]
    }
});