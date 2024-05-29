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

    fetch("./projects.json").then((data) => data.json())
        .then((json) => {
            for (let project of json) {
                $("#projects").append(`
                    <a class="project ${project.class}" href="/project?id=${project.id}">
                        <div class="thumb">
                            <img class="thumb" src="${project.thumb || "/assets/thumb.png"}">
                        </div>

                        <h2>${project.name}</h2>
                    </a>
                `)
            }
        })
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