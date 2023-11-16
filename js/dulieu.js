const FIREBASE_CONFIG = {
   apiKey: "AIzaSyDjfqKtzcnRMExnGSP_8j-wzaOkhAL55_Q",
  authDomain: "esp32-mx2.firebaseapp.com",
  databaseURL: "https://esp32-mx2-default-rtdb.firebaseio.com",
  projectId: "esp32-mx2",
  storageBucket: "esp32-mx2.appspot.com",
  messagingSenderId: "273854976046",
  appId: "1:273854976046:web:0914d0125eed13563ecfbf",
  measurementId: "G-LBX7H74CQL"
 }
 
 firebase.initializeApp(FIREBASE_CONFIG);
 var database = firebase.database();

 database.ref("/tan so").on("value", function (snapshot) {
    var tanso = snapshot.val();
    document.getElementById("tanso").innerHTML=tanso;
 }) ;

 database.ref("/Vab").on("value", function (snapshot) {
    var vab = snapshot.val();
    document.getElementById("vab").innerHTML=vab;
 });

 database.ref("/Vbc").on("value", function (snapshot) {
   var vbc = snapshot.val();
   document.getElementById("vbc").innerHTML=vbc;
});
 
database.ref("/Vca").on("value", function (snapshot) {
   var vca = snapshot.val();
   document.getElementById("vca").innerHTML=vca;
});

 database.ref("/Vaux").on("value", function (snapshot) {
    var vaux = snapshot.val();
    document.getElementById("vaux").innerHTML=vaux;
 });

 database.ref("/Iavg").on("value", function (snapshot) {
   var iavg = snapshot.val();
   document.getElementById("iavg").innerHTML=iavg;
});

database.ref("/Ia").on("value", function (snapshot) {
   var ia = snapshot.val();
   document.getElementById("ia").innerHTML=ia;
});

database.ref("/Ib").on("value", function (snapshot) {
   var ib = snapshot.val();
   document.getElementById("ib").innerHTML=ib;
});

database.ref("/Ic").on("value", function (snapshot) {
   var ic = snapshot.val();
   document.getElementById("ic").innerHTML=ic;
});

database.ref("/Van").on("value", function (snapshot) {
   var van = snapshot.val();
   document.getElementById("van").innerHTML=van;
});

database.ref("/Realpower").on("value", function (snapshot) {
   var real_power = snapshot.val();
   document.getElementById("real_power").innerHTML=real_power;
});

database.ref("/Powerfactor").on("value", function (snapshot) {
   var power_factor = snapshot.val();
   document.getElementById("power_factor").innerHTML=power_factor;
});

database.ref("/ApparentPower").on("value", function (snapshot) {
   var apparent_power = snapshot.val();
   document.getElementById("apparent_power").innerHTML=apparent_power;
});

