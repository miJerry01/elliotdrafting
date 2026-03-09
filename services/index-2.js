
let room = document.querySelector('.room-8-image');

gsap.to(room-8-image, {
  duration: 1,
  x: 526,
  repeat: 2,
  yoyo: true,
  delay: .5,
  ease: parametric

})

function parametric(progress) {
  var sqt = progress * progress;
  return sqt / (2.0 * (sqt - progress) + 1.0);

}

ScrollTrigger.create({
  trigger: "#main-content-box-3",
  start: "top center",
  end: "bottom center",
  onEnter: () => {
    gsap.to(img, { borderColor: "white", duration: 0.25 });
    gsap.fromTo(img, { x: 0 }, { x: 20, yoyo: true, repeat: 3, duration: 0.1 });
  },
  onLeave: () => gsap.to(img, { borderColor: "var(--clr-gray10)", duration: 0.25 }),
  onEnterBack: () => gsap.to(img, { borderColor: "var(--clr-gray70)", duration: 0.25 }),
  onLeaveBack: () => gsap.to(img, { borderColor: "var(--clr-gray10)", duration: 0.25 }),
});
