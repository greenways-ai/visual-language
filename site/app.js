const pattern=["100000001","010000010","001000100","000101000","000010000","000101000","001000100","010000010","100000001"].join("");
const cells=[...pattern].map((cell)=>{const node=document.createElement("i");node.dataset.on=cell==="1"?"true":"false";return node;});
document.querySelector("[data-mark]").replaceChildren(...cells);
const button=document.querySelector("[data-theme-button]");
const labels={auto:"Auto",light:"Light",dark:"Dark"};
const update=()=>button.textContent=labels[document.documentElement.dataset.themePreference||"auto"];
button.addEventListener("click",()=>setTimeout(update));update();
