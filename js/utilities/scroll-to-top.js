const fab = document.getElementById("scroll-to-top")

if (fab) {
	fab.addEventListener("click", () => {
		window.scroll({
			top: 0,
			behavior: "smooth"
		})
	})
}