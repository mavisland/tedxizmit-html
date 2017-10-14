jQuery(document).ready(function($){
  /**
   * Shrink Navbar
   */
  var $body = $('body');
  var $window = $(window);
  var windowWidth = $window.width();
  var headerContainer = $('#header');
  var getHeaderHeight = headerContainer.outerHeight();
  var lastScrollPosition = 0;

  if ( windowWidth > 768 ) {
    $window.scroll(function() {
      var currentScrollPosition = $window.scrollTop();
      if ( $(window).scrollTop() > 2 * getHeaderHeight ) {
        $body.addClass('scroll-active').css('padding-top', getHeaderHeight);
        headerContainer.css('top', 0);
        if ( currentScrollPosition < lastScrollPosition ) {
          headerContainer.css('top', '-' + getHeaderHeight + 'px');
        }
        lastScrollPosition = currentScrollPosition;
      } else {
        $body.removeClass('scroll-active').css('padding-top', 0);
        headerContainer.css('top', 0);
      }
    });
  }
});
