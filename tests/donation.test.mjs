import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeAmount,validateDonor,buildPayment} from '../donation-core.mjs';
import {donationConfig} from '../donation-config.mjs';
test('amounts retain exact paise and accept inclusive limits',()=>{
 for(const [input,expected] of [['1','1.00'],['000500.5','500.50'],['999.99','999.99'],['100000','100000.00']])assert.equal(normalizeAmount(input),expected);
});
test('reject invalid, zero, negative, excessive or ambiguous amounts',()=>{
 for(const input of ['','0','-5','.5','0.99','100000.01','1000000','1e3','1,000','NaN','Infinity','10.999','10.','₹50'])assert.throws(()=>normalizeAmount(input));
});
test('require name, accept Marathi name, validate optional fields',()=>{
 assert.equal(validateDonor({name:' सुरज बोडदे ',amount:'50'}).name,'सुरज बोडदे');
 for(const values of [{name:' '},{name:'<script>'},{name:'Test',email:'bad'},{name:'Test',city:'a'.repeat(81)}])assert.throws(()=>validateDonor({amount:'50',...values}));
});
test('default config is nonpayable and encodes entered amount',()=>{
 assert.equal(donationConfig.enabled,false);
 const payment=buildPayment('725.50',donationConfig,'AK12345678');
 assert.equal(payment.live,false);assert.match(payment.payload,/INR 725\.50/);assert.doesNotMatch(payment.payload,/upi:\/\/|@/);
});
test('live config encodes exact recipient, amount, currency, reference',()=>{
 const config={enabled:true,upiId:'test-account@bank',payeeName:'Test & Charity'};
 const first=buildPayment('1234.56',config,'AK12345678');
 const uri=new URL(first.payload);
 assert.equal(uri.protocol,'upi:');assert.equal(uri.host,'pay');
 assert.equal(uri.searchParams.get('pa'),config.upiId);assert.equal(uri.searchParams.get('pn'),config.payeeName);
 assert.equal(uri.searchParams.get('am'),'1234.56');assert.equal(uri.searchParams.get('cu'),'INR');assert.equal(uri.searchParams.get('tr'),'AK12345678');
 assert.notEqual(first.payload,buildPayment('50',config,'AK12345679').payload);
});
test('live mode fails closed without recipient configuration',()=>{
 for(const upiId of ['','replace-me','x@','test@bank&am=5'])assert.throws(()=>buildPayment('50',{enabled:true,upiId,payeeName:'NGO'},'AK12345678'));
});
