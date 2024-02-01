---
layout: page
title: ⚙️
---

<style>
.btn-link {
	color: inherit !important;
	padding: .3em;
	background-color: #0aa;
	text-decoration: none !important;
	border-radius: .3em;
	box-shadow: 0px 0 10px #0aa;
	border: none;
	cursor: pointer;
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

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function exportSettings() {
	download(location.hostname + "_settings.json", JSON.stringify(localStorage));
}
function importSettings() {
	let file_input = document.getElementById('file-input');
	file_input.click();
	file_input.addEventListener('change', () => {
		for (let f of file_input.files) {
			let r = new FileReader(); 
			r.readAsText(f);
			r.onloadend = () => {
				let obj = JSON.parse(r.result);
				localStorage.clear();
				for (let key of Object.keys(obj)) {
					localStorage.setItem(key, obj[key]);
				}
				alert("Settings imported !");
			};
		}
		file_input.value = null;
	});
}
addEventListener('load', async () => {
	if (navigator.storage && navigator.storage.persist && !await navigator.storage.persisted()) document.getElementById("btn-persist").style.display = "initial";
});
</script>

<button class="btn-link" onclick="exportSettings()">Export settings</button>

<input id="file-input" type="file" style="display: none" accept=".json">
<button class="btn-link" onclick="if (confirm('Warning: this operation will erase the entire current configuration!\nYou may export it before overwrite.')) importSettings()">Import settings</button>

<a style="font-size: 80%; float: right" href="#" onclick="if (confirm('Unregister service worker ? Site won\'t be available offline until SW is registred again')) { (async () => { for (let r of await navigator.serviceWorker.getRegistrations()) r.unregister(); })(); alert('Service worker unregistred !'); }">Unregister service worker</a>

<button id="btn-persist" style="display: none" class="btn-link" onclick="navigator.storage.persist()">Enable persistent storage</button>
