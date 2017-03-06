function printValues() {
		var scale = document.getElementById("scale").value;
		var depth = document.getElementById("depth").value;
		var rotationSpeed = document.getElementById("rotationSpeed").value;
		var branchWidth = document.getElementById("branchWidth").value;
		var branchLen = document.getElementById("branchLen").value;
		var branchAngle = document.getElementById("branchAngle").value;

		console.log("Scale: " + scale);
		console.log("Depth: " + depth);
		console.log("Rotation Speed: " + rotationSpeed);
		console.log("Branch Width: " + branchWidth);
		console.log("Branch Length: " + branchLen);
		console.log("Branch Angle: " + branchAngle);
}

window.onload = function() {
	document.getElementById("scale").addEventListener("input", printValues, false);
	document.getElementById("depth").addEventListener("input", printValues, false);
	document.getElementById("rotationSpeed").addEventListener("input", printValues, false);
	document.getElementById("branchWidth").addEventListener("input", printValues, false);
	document.getElementById("branchLen").addEventListener("input", printValues, false);
	document.getElementById("branchAngle").addEventListener("input", printValues, false);
}