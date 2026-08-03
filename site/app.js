const pattern=["1000000001","0100000010","0010000100","0001001000","0000110000","0000110000","0001001000","0010000100","0100000010","1000000001"].join("");
const cells=[...pattern].map((cell)=>{const node=document.createElement("i");node.dataset.on=cell==="1"?"true":"false";return node;});
document.querySelector("[data-mark]").replaceChildren(...cells);
const button=document.querySelector("[data-theme-button]");
const labels={auto:"Auto",light:"Light",dark:"Dark"};
const update=()=>button.textContent=labels[document.documentElement.dataset.themePreference||"auto"];
button.addEventListener("click",()=>setTimeout(update));update();
