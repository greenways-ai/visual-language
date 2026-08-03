const pattern=["1000001","0100010","0010100","0001000","0010100","0100010","1000001"].join("");
const cells=[...pattern].map((cell)=>{const node=document.createElement("i");node.dataset.on=cell==="1"?"true":"false";return node;});
document.querySelector("[data-mark]").replaceChildren(...cells);
const button=document.querySelector("[data-theme-button]");
const labels={auto:"Auto",light:"Light",dark:"Dark"};
const update=()=>button.textContent=labels[document.documentElement.dataset.themePreference||"auto"];
button.addEventListener("click",(event)=>{const resolved=document.documentElement.dataset.theme||"light";window.GreenwaysTheme?.apply(event.shiftKey?"auto":resolved==="dark"?"light":"dark",true);});
window.addEventListener("gw-theme-change",update);update();
