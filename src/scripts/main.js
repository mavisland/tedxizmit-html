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

  //
  // Konuşmacı Detayı Görüntü/Video Toggle
  var speakerObject      = $('.section-speaker-single .speaker-object');
  var speakerObjectPhoto = $('.section-speaker-single .object-photo');
  var speakerObjectVideo = $('.section-speaker-single .object-video');
  var speakerToggle      = $('.section-speaker-single .section-toggle');
  var speakerIframe      = $('.section-speaker-single .object-video iframe');
  if (speakerIframe.length) {
    var speakerIframeSrc = speakerIframe.attr("src");
  }
  speakerToggle.click(function(e){
    var iframe = $('.section-speaker-single .object-video iframe');
    var video  = $('.section-speaker-single .object-video video');

    if (speakerObjectPhoto.is(":visible")) {
      speakerObject.addClass("active");
      speakerObjectPhoto.fadeOut();
      speakerObjectVideo.fadeIn();

      if (iframe.length) {
        iframe.attr("src", speakerIframeSrc);
        return false;
      }
    } else {
      speakerObject.removeClass("active");
      speakerObjectVideo.fadeOut();
      speakerObjectPhoto.fadeIn();

      if (iframe.length) {
        iframe.attr("src", "");
        return false;
      }
      if (video.length) {
        video.pause();
      }
    }
    e.preventDefault();
  })
});
