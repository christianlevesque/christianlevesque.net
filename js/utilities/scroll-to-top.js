import $ from "jquery"
const fab = document.getElementById("scroll-to-top")

if (fab) {
	fab.addEventListener("click", () => {
		$("html, body").animate({scrollTop: 0}, "slow")
	})
}