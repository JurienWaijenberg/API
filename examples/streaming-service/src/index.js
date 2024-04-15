import './index.css';

console.log('Hello, world!');

// Animatie gsap
// const title = document.querySelector('.poster__title')

// if (title) {
//     gsap.to(title, {
//         scale: 3,
//         duration: 1,
//     })
// }


// Share functie

const shareData = {
    title: "MDN",
    text: "Learn web development on MDN!",
    url: "https://developer.mozilla.org",
  };
  
  const btn = document.querySelector(".button");
  const resultPara = document.querySelector(".result");
  
  // Share must be triggered by "user activation"
  btn.addEventListener("click", async () => {
    try {
      await navigator.share(shareData);
      resultPara.textContent = "MDN shared successfully";
    } catch (err) {
      resultPara.textContent = `Error: ${err}`;
    }
  });