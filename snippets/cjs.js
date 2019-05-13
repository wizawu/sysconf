document.querySelectorAll("*").forEach(n => {
  if (!n.innerText) return;
  let ff = window.getComputedStyle(n).getPropertyValue("font-family");
  if (ff && !ff.endsWith("monospace")) n.style.fontFamily = "sans";
})