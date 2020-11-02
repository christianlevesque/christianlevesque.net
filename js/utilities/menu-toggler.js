const mainMenu = document.getElementById("main-menu")
const toggler = document.getElementById("toggler")
const togglerIcon = document.getElementById("toggler-icon")

if (toggler) {
	toggler.addEventListener("click", e => {
		mainMenu.classList.toggle("open")
		togglerIcon.classList.toggle("fa-bars")
		togglerIcon.classList.toggle("fa-times")
	})
}