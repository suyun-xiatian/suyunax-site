window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true,
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex",
  },
};

let mathJaxLoading;

function loadMathJax() {
  if (window.MathJax?.typesetPromise) {
    return Promise.resolve(window.MathJax);
  }

  if (!mathJaxLoading) {
    mathJaxLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/mathjax@3.2.2/es5/tex-mml-chtml.js";
      script.async = true;
      script.onload = () => window.MathJax.startup.promise.then(() => resolve(window.MathJax));
      script.onerror = () => reject(new Error("MathJax 加载失败"));
      document.head.appendChild(script);
    });
  }

  return mathJaxLoading;
}

function renderMath(root = document) {
  const elements = root.matches?.(".arithmatex")
    ? [root]
    : [...root.querySelectorAll(".arithmatex")];

  if (elements.length === 0) return;

  loadMathJax()
    .then((mathJax) => {
      mathJax.typesetClear(elements);
      mathJax.texReset();
      return mathJax.typesetPromise(elements);
    })
    .catch((error) => console.error(error));
}

document$.subscribe(() => renderMath(document));

component$.subscribe(({ ref }) => {
  if (ref.classList.contains("md-annotation")) {
    renderMath(ref);
  }
});
