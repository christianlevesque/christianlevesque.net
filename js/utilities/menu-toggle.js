const toggler = document.getElementById("toggler")
const icon = document.getElementById("toggler-icon-hamburger")
const nav = document.getElementById("main-menu")

let open = false

if (toggler && icon && nav) {
	toggler.addEventListener("click", toggleMenu)

}

function toggleMenu(event) {
	icon.classList.toggle("fa-bars")
	icon.classList.toggle("fa-times")
	nav.classList.toggle("navbar--open")

	if (open) {
		document.body.removeEventListener("click", bodyToggleMenu)
		open = false
	}
	else {
		document.body.addEventListener("click", bodyToggleMenu)
		open = true
	}

	event.stopPropagation()
}

function bodyToggleMenu(event) {
	if (nav.contains(event.target))
		return

	toggleMenu(event)
}