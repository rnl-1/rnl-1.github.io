---
layout: page
title: Timer ⏲️
---
<style>
.btn-link {
	color: inherit !important;
	padding: .3em;
	background-color: #0aa;
	text-decoration: none !important;
	border-radius: .3em;
	box-shadow: 0px 0 10px #0aa;
}
.btn-link:hover {
	background-color: #0bb;	
}
.btn-link:active {
	background-color: #099;
}
.btn-link-orange {
    background-color: orange;
    box-shadow: 0px 0 10px orange;
}
.btn-link-orange:hover {
    background-color: rgb(255, 184, 53);
}
.btn-link-orange:active {
    background-color: rgb(225, 146, 0);
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

function updateLink() {
	let duration_str = document.getElementById("timer-duration").value;
	if (!/^[0-9]{1,2}:[0-9]{2}$/.test(duration_str)) return;
	let mins = duration_str.split(':').map((u, i) => u * 60 ** (1-i)).reduce((a, b) => a + b);
	document.getElementById('start-btn').href = "{{ '/timer' | relative_url }}?" + document.getElementById("timer-name").value + ";" + mins;
}
addEventListener('load', function() {
	["timer-name", "timer-duration"].map(u => document.getElementById(u)).map(u => u.addEventListener('input', updateLink));
	updateLink();
	const bg_color = document.getElementById('bg-color');
	bg_color.value = localStorage.color || "#00abff";
	bg_color.addEventListener('change', () => {
		localStorage.color = bg_color.value;
	});
	let u = (+localStorage.time_begin) + (+localStorage.period)*1000;
	if (!isNaN(u) && u > new Date().getTime()) {
		document.getElementById('id-resume').style.display = 'initial';
	}
});
</script>
<noscript><span style="color: red">JavaScript required</span></noscript>
<a id="id-resume" href="{{ '/timer' | relative_url }}" class="btn-link btn-link-orange" style="display: none">⏩ Resume timer</a>
<form onsubmit="document.getElementById('start-btn').click()">
<label for="timer-name">Timer name</label>
<br/>
<input id="timer-name" name="timer-name" placeholder="Timer">
<br/>
<label for="timer-duration">Duration (hh:mm)</label>
<br/>
<input id="timer-duration" name="timer-duration" required pattern="[0-9]{1,2}:[0-9]{1,2}" value="2:00">
<input type="submit" style="display: none">
<br/>
<br/>
<a href="{{ '/timer' | relative_url }}" id="start-btn" class="btn-link">Start</a>
<br/>
<br/>
<label for="bg-color">Background color</label>
<br/>
<input id="bg-color" type="color">
</form>
