import $ from "jquery"
const fab = $("#scroll-to-top")

if (fab) {
	fab.click(() => {
		$("html, body").animate({scrollTop: 0}, "slow")
	})
}