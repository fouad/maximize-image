(function() {
'use strict'

var overlay = null;

function _extend(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    if (!arguments[i])
      continue;

    for (var key in arguments[i]) {
      if (arguments[i].hasOwnProperty(key))
        out[key] = arguments[i][key];
    }
  }

  return out;
}

function addOverlay(opts, img) { 
  if (!opts.overlay) {
    return;
  }

  overlay = document.createElement('div');

  overlay.style.background = opts.bg || 'rgba(255,255,255,.65)';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style['z-index'] = 800;

  overlay.addEventListener('click', function() {
    resetImage(img);
  });

  document.body.insertBefore(overlay, document.body.firstChild);
}

function resetImage(img) {
  img.style['-webkit-transform'] = 'translate(0, 0) translateZ(0)';
  img.style['z-index'] = 0;

  // check if it exists
  if (overlay !== null) {
    overlay.parentNode.removeChild(overlay);
  }

  // detach scroll listener
  window.onscroll = null;

  img.toggled = false;
}

function maximizeImage(query, opts) {
  var images = document.querySelectorAll(query);
  
  var defaults = {
    overlay: true
  };

  if (arguments.length === 1) {
    opts = defaults;
  } else {
    opts = _extend({}, defaults, opts);
  }

  console.log(opts)

  for (var i = 0; i < images.length; i++) {
    var img = images[i];

    img.style.cursor = '-webkit-zoom-in';

    img.addEventListener('click', function() {
      if (!this.toggled) {
        this.style.position = 'relative';
        var winWidth = window.innerWidth / 2
          , left = this.offsetLeft + (this.offsetWidth / 2);

        var imgRect = this.getBoundingClientRect();

        var img = this;

        window.onscroll = function(ev) {
          resetImage(img);
        };

        window.onresize = function(ev) {
          resetImage(img);
        };

        var winHeight = window.innerHeight;

        // put image on top first
        this.style['z-index'] = 1000;

        console.log('br.top', imgRect.top)

        var top = ((winHeight / 2) - this.offsetHeight / 2) - imgRect.top;

        var scale = (this.offsetWidth / this.offsetHeight);

        if (scale > 1) {
          scale = (this.offsetHeight / this.offsetWidth);
        }

        var translate = 'translate(' + (winWidth - left) + 'px, ' + top + 'px) translateZ(0) scale(' + scale + ')';

        this.style['-webkit-transform'] = translate;
        this.style.cursor = '-webkit-zoom-out';
        this.toggled = true;

        addOverlay(opts, this);
      } else {
        this.style.cursor = '-webkit-zoom-in';
        resetImage(this);
      }
    });
  };
}

window.maximizeImage = maximizeImage;
})();