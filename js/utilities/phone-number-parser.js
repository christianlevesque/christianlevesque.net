/**
 * @param {string} phoneNumber
 */
function parsePhone(phoneNumber) {
	let parsed = phoneNumber.replace(/one/gi, "1")
		.replace(/two/gi, "2")
		.replace(/three/gi, "3")
		.replace(/four/gi, "4")
		.replace(/five/gi, "5")
		.replace(/six/gi, "6")
		.replace(/seven/gi, "7")
		.replace(/eight/gi, "8")
		.replace(/nine/gi, "9")
		.replace(/oh/gi, "0")
		.replace(/zero/gi, "0")
		.replace(/\D/gi, "")

	if (parsed.length !== 10) {
		return`(invalid)`
	}

	return `(${parsed.substr(0, 3)}) ${parsed.substr(3, 3)}-${parsed.substr(6)}`
}

const phoneNumberParser = document.forms["phone-number-parser"]

if (phoneNumberParser) {
	phoneNumberParser.addEventListener("submit", function(e) {
		e.preventDefault()
		const input = document.getElementById("phone-number-input")
		const output = document.getElementById("phone-number-parser-output")
		output.innerText = parsePhone(input.value)
	})
}