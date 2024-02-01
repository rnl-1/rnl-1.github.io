---
layout: page
title: Exercise tracker ✏️
---
<style>
.btn-link {
	color: inherit !important;
	padding: .3em;
	background-color: #0aa;
	text-decoration: none !important;
	border-radius: .3em;
	box-shadow: 0px 0 10px #0aa;
	margin: 0 .4em;
}
.btn-link:hover {
	background-color: #0bb;	
}
.btn-link:active {
	background-color: #099;
}
</style>
<script>
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('sw.js', { scope: './' });
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
registerServiceWorker();

addEventListener('load', function() {
	let links = Object.keys(localStorage).filter(u => u.startsWith("t_categories")).map(u => u.slice("t_categories".length)).map(u => [u ? decodeURI(u) : "Main", "/tracker" + (u ? "?" + u : "")]);
	if (links.length) {
		let list_cat = document.getElementById('list-categories');
		list_cat.textContent = '';
		for (let l of links) {
			let a = document.createElement('a');
			a.href = l[1];
			a.textContent = l[0];
			a.classList.add('btn-link');
			list_cat.append(a);
			list_cat.append(' ');
		}
	}
});
</script>
<div id="list-categories">
<a class="btn-link" href="{{ '/tracker' | relative_url }}">Main</a>
</div>
<br/>
<a onclick="event.preventDefault(); let u = prompt('Name ?'); if (u) location.href = '{{ '/tracker' | relative_url }}?'+u;" href="#">Ajouter une catégorie</a>
<br/><br/>
<a href="tracker-act" style="color:grey">Activité</a>
