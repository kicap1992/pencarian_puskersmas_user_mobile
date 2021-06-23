/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const url = 'https://pencarian-puskesmas.kicap-karan.com/';
// const url = 'https://192.168.43.125/puskesmas_admin/'

function $_GET(param) {
  var vars = {};
  window.location.href.replace( location.hash, '' ).replace( 
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function( m, key, value ) { // callback
      vars[key] = value !== undefined ? value : '';
    }
  );

  if ( param ) {
    return vars[param] ? vars[param] : null;  
  }
  return vars;
}

var id_warkop = $_GET('id');
var kordinat_a = $_GET('kordinat').split(',')[0];
var kordina_b = $_GET('kordinat').split(',')[1];

function klik_peta(){
  // window.open('https://www.google.com/maps/dir/?api=1&destination='+kordinat_a+','+kordina_b+'&travelmode=driving&waypoints=-4.02091,119.62752|-4.05714,119.65665', '_system'); 
  window.open('https://www.google.com/maps/dir/?api=1&destination='+kordinat_a+','+kordina_b+'&travelmode=driving', '_system'); 
  return false;
}
// console.log(kordinat_sekarang)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!
  // alert("sukses");
  // ambil_peta();

  // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  // document.getElementById('deviceready').classList.add('ready');

}




function blockUI(){

  $.blockUI({ 
      message: "Aktifkan \n GPS", 
      css: { 
      border: 'none', 
      padding: '15px', 
      backgroundColor: '#000', 
      '-webkit-border-radius': '10px', 
      '-moz-border-radius': '10px', 
      opacity: .5, 
      color: '#fff' 
    } });
}
if ('permissions' in navigator) {
  navigator.permissions.query({name:'geolocation'}).then(function(result) {
    if (result.state == 'granted') {
      report(result.state);
      // geoBtn.style.display = 'none';
      $.unblockUI();
    } else if (result.state == 'prompt') {
      
      blockUI();
      report(result.state);
      // geoBtn.style.display = 'none';
      // navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
    } else if (result.state == 'denied') {
      report(result.state);
      // geoBtn.style.display = 'inline';
      blockUI();
    }
    result.onchange = function() {
      // report(result.state);
      if (result.state == 'granted') {
          $.noConflict();
        $.unblockUI();
      }else{
        blockUI();
      }
    }
  });
}


function report(state) {
  // console.log('Permission ' + state);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function initMap() {
  // console.log($("#kordinat_warkop").val())
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;
  var map = new google.maps.Map(document.getElementById("map1"), {
    zoom: 7,
    center: new google.maps.LatLng(-4.0127077,119.6031278),
    mapTypeControl: false,
    mapTypeId: "hybrid"
  });
  directionsDisplay.setMap(map);
  // directionsDisplay.setPanel(document.getElementById('right-panel'));

  // var pointb = new google.maps.LatLng(-3.9935955,119.6615051); 
  var pointa = new google.maps.LatLng(kordinat_a , kordina_b);

 
  // calculateAndDisplayRoute(directionsService, directionsDisplay,pointa,pointb);
  
  navigator.geolocation.watchPosition((position) => {
    // console.log(position.coords.latitude, position.coords.longitude);
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var lat = 0;
    var long = 0;
    if (lat != latitude && long != longitude) {
      calculateAndDisplayRoute(directionsService, directionsDisplay,pointa,new google.maps.LatLng(latitude , longitude))
      console.log(latitude)
      console.log(longitude)
    }
  },(err)=>{
    // console.log(err);
    // $.noConflict();
    $.unblockUI();
    swal({
      // title: "Submit Keperluan ?",
      text: "Aktifkan GPS untuk melihat rute",
      icon: "warning",
      buttons: {
          cancel: false,
          confirm: true,
        },
      // dangerMode: true,
    })
    .then((hehe) =>{
      location.reload();
    });
  },{enableHighAccuracy: true});

}


function calculateAndDisplayRoute(directionsService, directionsDisplay,pointa,pointb) {
  var start = pointa;
  var end = pointb;
  // console.log(directionsService.route());

  directionsService.route({
    origin: start,
    destination: end,
    travelMode: "DRIVING"
  }, function(response, status) {
    if (status === "OK") {
      // jQuery.noConflict()
      // $.unblockUI();
      directionsDisplay.setDirections(response);

    } else {
      if (status === 'ZERO_RESULTS') {
        // jQuery.noConflict()
        $.blockUI({ message: '<div width="100%"><h6>Lokasi Anda Tidak Dapat Terdeteksi, Sila Matikan Koneksi VPN anda</h6></div>' }); 
      }
      
      // window.alert("Directions request failed due to " + status);
      
      // console.log(status)
    }
  });
}


$.ajax({
  url: url+"home",
  type: 'post',
  data: {proses : "cek_id", id : id_warkop},
  // async: false,
  dataType: 'json',
  // success: function (response) {
  //   $("#sini_idnya").val(response);
  //   // location.reload();
  // }
  
}).then(res =>{

  $("#nama").html(res[0].nama);
  $("#alamat").html(res[0].alamat);
  // $("#info").html(res[0].info);
  const nomor = nomor_telponnya(res[0].kontak)
  $("#kontak").html(nomor);
  const info = "window.plugins.socialsharing.shareViaWhatsAppToPhone('"+nomor+"', 'Message via WhatsApp', null /* img */, null /* url */, function() {console.log('share ok')})"
  // const info = 'window.open("https://api.whatsapp.com/send?phone= '+nomor+'", "_system")'
  $("#kontaknya").attr("onclick",info);
  // console.log(res[0].info_faskes)
  // $("#info_faskes").html(res[0].info_faskes);
  $("#jumlah_perawat").html(res[0].jumlah_perawat);
  var faskesnya = res[0].array_faskes;
  faskesnya = JSON.parse(faskesnya);
  console.log(faskesnya)
  var html_nya = ''
  for (var i = 0; i < faskesnya.length; i++) {
    var ii = i+1;
    
    html_nya += '<div><i class="icofont-ambulance"></i><h4>Info Fasilitas '+ii+':</h4><p>'+faskesnya[i].nama+'</p><p>Jam Buka : '+faskesnya[i].buka+'</p><p>Jam Tutup : '+faskesnya[i].tutup+'</p></div><br>'

    $("#sini_fasilitasnya").html(html_nya)
    

  }
})


$.ajax({
  url: url+"home",
  type: 'post',
  data: {proses : "cek_foto_detail", id : id_warkop},
  // async: false,
  // dataType: 'json',
  success: function (response) {
    $("#foto").html(response);
    // location.reload();
  }
  
})

function nomor_telponnya(hp){
  if (hp.length == 12) {
    hp = "+62 "+hp[1]+hp[2]+hp[3]+"-"+hp[4]+hp[5]+hp[6]+hp[7]+"-"+hp[8]+hp[9]+hp[10]+hp[11];
  }else if (hp.length == 13) {
    hp = "+62 "+hp[1]+hp[2]+hp[3]+"-"+hp[4]+hp[5]+hp[6]+hp[7]+"-"+hp[8]+hp[9]+hp[10]+hp[11]+hp[12];
  }else if (hp.length == 11) {
    hp = "+62 "+hp[1]+hp[2]+hp[3]+"-"+hp[4]+hp[5]+hp[6]+hp[7]+"-"+hp[8]+hp[9]+hp[10];
  }else if (hp.length == 10) {
    hp = "+62 "+hp[1]+hp[2]+hp[3]+"-"+hp[4]+hp[5]+hp[6]+"-"+hp[7]+hp[8]+hp[9];
  }
  return hp;
}

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
// hehe();
function hehe (){
  // await sleep(1000);
  $("#sini_htmlnya").html('<script src="assets/dist/js/lightbox-plus-jquery.min.js"></'+'script>');
}

setTimeout(function(){
  hehe();
}, 2000);

