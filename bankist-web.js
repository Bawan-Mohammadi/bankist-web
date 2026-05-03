"use strict";
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
// window.scrollTo(0, 0);

const openAccount = document.querySelector(".open-account");
const openAccountModal = document.querySelector(".open-account-modal");
const modalBlur = document.querySelector(".modal-blur");
const modalCloseBtn = document.querySelector(".modal-close");
const body = document.querySelector("body");
const modalNameInput = document.querySelectorAll(".name");
const modalInputs = document.querySelectorAll(".modal-inputs");
const openAccountBottom = document.querySelector(".section-four-open-account");
const sectionOneBorderBottom = document.getElementById("header-border-bottom");
const header = document.querySelector(".header");
const learnMoreButton = document.querySelector(".learn-more");
const sectionOne = document.querySelector(".section-one");
const tabs = document.querySelectorAll(".section-two-buttons");
const tabsContainer = document.querySelector(".section-two-buttons-holder");
const tabsContent = document.querySelectorAll(".section-two-text-holder");
const allSections = document.querySelectorAll(".section");
const nav = document.querySelector(".nav");
const imgTargets = document.querySelectorAll("img[data-src]");
const rightNav = document.querySelector(".nav-right-side");
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const sliderLeftBtn = document.querySelector(".left-btn");
const sliderRightBtn = document.querySelector(".right-btn");
const dotsContainer = document.querySelector(".section-three-dots-container");
const dots = document.querySelectorAll(".section-three-dots");


const openModalFunction = function () {
  openAccountModal.classList.add("show");
  modalBlur.classList.add("show");
};
openAccount.addEventListener("click", openModalFunction);

const closeModalFunction = function () {
  openAccountModal.classList.remove("show");
  modalBlur.classList.remove("show");
  modalInputs.forEach((input) => {
    input.value = "";
  });
};

openAccountBottom.addEventListener("click", openModalFunction);
modalCloseBtn.addEventListener("click", closeModalFunction);
modalBlur.addEventListener("click", closeModalFunction);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeModalFunction();
  }
});
modalNameInput.forEach((name) =>
  name.addEventListener("keydown", function (event) {
    if (
      !isLetter(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "Tab"
    ) {
      event.preventDefault();
    }
  }),
);
const cookieMessage = document.createElement("div");
cookieMessage.classList.add("cookie-message");
cookieMessage.innerHTML =
  'We use cookies for improved functionality and analytics.<button class="cookie-message-button"> Got it! </button> ';

header.append(cookieMessage);
document
  .querySelector(".cookie-message-button")
  .addEventListener("click", function () {
    cookieMessage.remove();
  });
learnMoreButton.addEventListener("click", function () {
  //get the coordinates of the section we want to scroll to
  sectionOne.scrollIntoView({ behavior: "smooth" });
});

rightNav.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav-link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//tab component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest("[data-tab]");
  if (!clicked) return;

  console.log(clicked.dataset.tab); // debug

  tabs.forEach((t) => t.classList.remove("section-two-buttons--active"));
  clicked.classList.add("section-two-buttons--active");

  tabsContent.forEach((c) =>
    c.classList.remove("section-two-text-holder--active"),
  );

  const content = document.querySelector(
    `.section-two-text-holder--${clicked.dataset.tab}`,
  );

  if (!content) return; // safety

  content.classList.add("section-two-text-holder--active");
});

// nav fade

const handleHover = function (e) {
  if (
    e.target.classList.contains("nav-link") ||
    e.target.classList.contains("nav-button")
  ) {
    const link = e.target;
    const nav = link.closest(".nav");

    const siblings = nav.querySelectorAll(".nav-link");
    const buttons = nav.querySelectorAll(".nav-button");
    const logo = nav.querySelector(".logo");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });

    buttons.forEach((btn) => {
      if (btn !== link) btn.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// addEventListener normally only passes the event object (e) to the handler.
// If you want to pass extra arguments, a common trick is to use bind() and store the value in this.
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//sticky nav

const navHeight = nav.getBoundingClientRect().height;
const bodyHeight = body.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; //get the first element
  // if the target in not intersectiong the root
  if (!entry.isIntersecting) {
    // scrolling DOWN
    nav.classList.add("sticky");
    nav.classList.remove("sticky-out");
    body.style.marginTop = `${navHeight}px`;
  } else {
    // scrolling UP
    nav.classList.add("sticky-out");

    // wait for animation to finish before removing sticky
    nav.addEventListener(
      "animationend",
      () => {
        nav.classList.remove("sticky");
        nav.classList.remove("sticky-out");
        body.style.marginTop = "0px";
      },
      { once: true },
    );
  }
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //entire viewport
  threshold: 0, //the precentage visible of the header we want smth to happen at
  rootMargin: `-${navHeight}px`, //will be applied outside of our target element. here, header
});
headerObserver.observe(header);

//revealing sections

const revealSection = function (entries, observer) {
  //because all the sections get loaded at the beginning, we need to loop over them and
  //run the code, ottherwise IntersectionObserver may report multiple intersections at once
  entries.forEach((entry) => {
    //if it's not intersecting return right away
    if (!entry.isIntersecting) return;
    //when it reaches the target section it needs to be shown
    entry.target.classList.remove("section-hidden");
    observer.unobserve(entry.target);
  });
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
  rootMargin: "200px", //load the images before
});
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section-hidden");
});

//lazy loading images

const loadImg = function (entries, observer) {
  //one threshold one entry, log the entry for info
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //remove lazy image class once it's done loading
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
imgTargets.forEach((image) => imgObserver.observe(image));

//close scroll behind modal
// click outside modal
//make px, rem

//making the slider

let currentSlide = 0;
const maxSlide = slides.length;
//in the beginning we are at slide 0 but as we go on we need to increase that
//for slides. also the translate starts at -100. the active slide is 0%
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%  )`),
  );
};
goToSlide(0);
const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
const prevSlide = function () {
  if (currentSlide == 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
sliderRightBtn.addEventListener("click", nextSlide);
sliderLeftBtn.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") {
    prevSlide();
  }
  if (e.key === "ArrowRight") {
    nextSlide();
  }
});

//dots
dotsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("section-three-dots")) {
    const curSlide = Number(e.target.dataset.slide);
    goToSlide(curSlide);
    activateDot(curSlide);
  }
});
const activateDot = function (slide) {
  dots.forEach((dot) => dot.classList.remove("section-three-dots--active"));
  document
    .querySelector(`.section-three-dots[data-slide="${slide}"]`)
    .classList.add("section-three-dots--active");
};
