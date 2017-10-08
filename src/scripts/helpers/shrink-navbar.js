jQuery(document).ready(function($){
  /**
   * Shrink Navbar
   */
  var $window = $(window);
  var navbar = $('#header');

  $window.scroll(function() {
    if ($window.scrollTop() > 100) {
      navbar.addClass('fixed-nav');
    } else {
      navbar.removeClass('fixed-nav');
    }
  });
});
