$(() => {
    if (window.location.hash) {
        refreshSections()
    }

    setTimeout(() => {
        $("#loading-overlay")
            .css({ 
                "opacity": 0,
                "pointer-events": "none"
             })
    }, 4)
})

function refreshSections() {
    setTimeout(() => {
        $("section").hide()
        const t = $(window.location.hash).show()
        if (!t.length) {
            $("#about").show()
        }
    }, 1)
}

function toggleResponsiveNav() {
    $("#nav").toggleClass("responsive")
}