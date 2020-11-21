$(document).on('ready', function () {
     // initialization of custom scrollbar
     $.HSCore.components.HSScrollBar.init($('.js-custom-scroll'));
  
     // initialization of hamburger
     $.HSCore.helpers.HSHamburgers.init('.hamburger');
 
     // initialization of sidebar navigation component
     $.HSCore.components.HSSideNav.init('.js-side-nav', {
     });
 
     // initialization of custom scrollbar
     $.HSCore.components.HSScrollBar.init($('.js-custom-scroll'));
});