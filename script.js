var EMAIL="narendra.seo@example.com"; /* replace with your real email */
var q=function(i){return document.getElementById(i)},ids=["n","e","p","s","m"],sent=false;
function ok(){var v=ids.every(function(i){return q(i).value.trim()});
 v=v&&/^\S+@\S+\.\S+$/.test(q("e").value.trim())&&q("p").value.replace(/\D/g,"").length>=10;q("b").disabled=!v||sent;return v}
ids.forEach(function(i){q(i).addEventListener("input",ok);q(i).addEventListener("change",ok)});
q("f").addEventListener("submit",function(ev){ev.preventDefault();if(sent||!ok())return;sent=true;q("b").disabled=true;
 var body="Name: "+q("n").value+"\nEmail: "+q("e").value+"\nPhone: "+q("p").value+"\nService: "+q("s").value+"\n\n"+q("m").value;
 window.open("mailto:"+EMAIL+"?subject="+encodeURIComponent("New SEO request: "+q("s").value)+"&body="+encodeURIComponent(body),"_self");
 q("mo").classList.add("on")});
q("x").onclick=function(){q("mo").classList.remove("on");q("f").reset();sent=false;ok()};