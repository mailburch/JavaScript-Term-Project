function openTab(evt, tabName) {
    var i, tabcontent, tabbuttons;

    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove "active" class from all buttons
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].classList.remove("active");
    }

    // Show the selected tab and mark the button as active
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// Set default active tab (if needed)
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("about").style.display = "block";
});
