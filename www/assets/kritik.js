var url ="https://pencarian-puskesmas.kicap-karan.com/";
if (localStorage.getItem("ket1") != null) {
  
  swal({
    text: "Terima Kasih Atas Pengaduan Yang Diinput",
    title: "Pangaduan Sukses",
    icon: "success",
    buttons: false,
    timer : 3000
  });

  
  localStorage.removeItem("ket1");
  // localStorage.removeItem("nik");
}

function kirim(){
  const nama = $("#nama");
  const email = $("#email");
  const subjek = $("#subjek");
  const ket = $("#ket");

  if (nama.val() == '' || nama.val() == null) {
    toastnya('nama','Nama tidak boleh kosong')
  }

  else if (email.val() == '' || email.val() == null) {
    toastnya('email','Email tidak boleh kosong')
  }

  else if (validateEmail(email.val()) == false) {
    toastnya('email','Format email yang dimasukkan salah')
  }

  else if (subjek.val() == '' || subjek.val() == null) {
    toastnya('subjek','Subjek pengaduan tidak boleh kosong')
  }

  else if (ket.val() == '' || ket.val() == null) {
    toastnya('ket','Keterangan pengaduan tidak boleh kosong')
  }

  else{
    
    swal({
      title: "Submit Pengaduan?",
      text: "Pengaduan anda akan disubmit ke sistem untuk direview oleh admin",
      icon: "info",
      buttons: true,
    })
    .then((logout) => {
      if (logout) {
        var data = $('#sini_form').serializeArray();
        $.ajax({
          url: url+"home/",
          type: 'post',
          data: {data : data, proses : 'pengaduan'},
          // dataType: 'json',
          beforeSend: function(res) {                   
            $.blockUI({ 
              message: "Sedang Diproses", 
              css: { 
              border: 'none', 
              padding: '15px', 
              backgroundColor: '#000', 
              '-webkit-border-radius': '10px', 
              '-moz-border-radius': '10px', 
              opacity: .5, 
              color: '#fff' 
            } });
          },
          success: function (response) {
            
            localStorage.setItem("ket1", response);
            location.reload();

          },
          error: function(XMLHttpRequest, textStatus, errorThrown) { 
            $.unblockUI();
            swal({
              // title: "Submit Keperluan ?",
              text: "Koneksi Internet Anda Mungkin Hilang Atau Terputus, Halaman Akan Terefresh Kembali",
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
           
          } 
        });
      } 
    });
    
      
  }
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function toastnya(id,mesej){
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  toastr.error("<center>"+mesej+"</center>");
  $("#"+id).focus();
}