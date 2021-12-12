// Scroll warp effect
import scrollWarp from "./lib/scroll-warp";
import scrollbarPadding from "./lib/scrollbar-padding";

// GIF 3D rotation effect
import RubbableGif from "./vendors/rubbable";

// Stimulus JS
import { Application } from "@hotwired/stimulus"
import AppController from "./controllers/app_controller"
import OverlayController from "./controllers/overlay_controller"
import BookingController from "./controllers/booking_controller"

window.Stimulus = Application.start()
Stimulus.register("app", AppController)
Stimulus.register("overlay", OverlayController)
Stimulus.register("booking", BookingController)

const warpConfig = {
  num: 2,
  theta: 1.1,
}

// Initialize everthing after jQuery is ready
$(function() {
  const $content = $('#content')[0];
  scrollbarPadding();
  scrollWarp($content, 100, warpConfig.num, warpConfig.theta);

  // Init Rubabble - TODO: Move to its own controller
  if (window.innerWidth >= 600) {
    var sup2 = new RubbableGif({gif: document.getElementById('studio-desktop')});
    sup2.load();
  } else {
    var sup2 = new RubbableGif({gif: document.getElementById('studio-mobile')});
    sup2.load();
  }
});

