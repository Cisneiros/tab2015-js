function setupParallax(){
  var PARALLAX_TOLERANCE = 100; // px
  
  var sections = document.querySelectorAll('section.main');
  
  document.addEventListener('scroll', function() {
    Array.prototype.forEach.call(sections, applyParallax);
  });

  function applyParallax(section) {
    var container = section.querySelector('.container');
    
    window.requestAnimationFrame(function() {
      var rect = section.getBoundingClientRect();
      
      if (rect.bottom < window.innerHeight-PARALLAX_TOLERANCE && rect.bottom > 0) {
        var offset = Math.floor((rect.top + PARALLAX_TOLERANCE + (rect.height - window.innerHeight)) / 2);

        container.style.top = offset + 'px';
      } else {
        container.style.top = '0px';
      }
    });
  }
};

setupParallax();
