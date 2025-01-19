// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all collapsible elements
    var coll = document.getElementsByClassName("collapsible");

    // Add click event listener to each collapsible element
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            // Toggle active class
            this.classList.toggle("active");
            
            // Get the content section
            var content = this.nextElementSibling;
            
            // Toggle the content visibility
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
});