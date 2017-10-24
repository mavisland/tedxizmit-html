jQuery(document).ready(function($){
  //
  // Geri Sayim Sayaci
  $('[data-countdown]').each(function() {
    var $this = $(this), finalDate = $(this).data('countdown');
    $this.countdown(finalDate, function(event) {
      $(this).html(event.strftime(''
        + '<div class="count-item"><span class="count-time">%D</span><span class="count-label">g&uuml;n</span></div>'
        + '<div class="count-item"><span class="count-time">%H</span><span class="count-label">saat</span></div>'
        + '<div class="count-item"><span class="count-time">%M</span><span class="count-label">dakika</span></div>'
        + '<div class="count-item"><span class="count-time">%S</span><span class="count-label">saniye</span></div>'));
    });
  });

  //
  // Yüklenen Resmi Önizleme Yapma
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
        $('#blah').attr('src', e.target.result);
        $('#blah').hide();
        $('#blah').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#imgInp").change(function() {
    readURL(this);
  });
});
