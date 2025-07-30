
let nodemailer=require('nodemailer');
let transporter =nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'reenatanchak@gmail.com',
    pass:'anar rnaa rouw uwxn'
  }
});
let mailOptions={
  from:'reenatanchak@gmail.com',
  to:'reenatanchak@gmail.com',
  subject:'sending mail using node emailer',
  text:'that was is easy'
};
transporter.sendMail(mailOptions,function(error,info){
 if(error){
  console.log(error);
 }
 else{
  console.log("email sent:"+info.response);
 }
}
);
