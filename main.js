let projects

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

    $("#modal-container").on("click", function (event) {
        $(this).hide()
    })

    const props = {
        age: Math.abs(new Date(Date.now() - new Date('28 Nov 2003 00:00:00 GMT')).getFullYear() - 1970)
    }

    $("b").each(function() {
        let text = $(this).text();
        for (let prop of Object.keys(props)) {
            text = text.replaceAll(`{{${prop}}}`, props[prop])
        }
        $(this).text(text)
    })

    fetch("./projects.json").then((data) => data.json())
        .then((json) => {
            projects = json
            for (let project of json) {
                $("#projects").append(`
                    <a class="project ${project.class}" href="#projects" onclick='showProjectModal("${project.id}")'>
                        <div class="thumb">
                            <img class="thumb" src="${project.thumb || "/assets/thumb.png"}">
                        </div>

                        <h2>${project.name}</h2>
                    </a>
                `)
            }
        })
})

function showProjectModal(id) {
    const project = projects.find((p) => p.id == id);
    $("#modal-container").css({
        display: "flex",
        opacity: 0,
        transform: `scale(0)`
    })

    $("#modal-container").animate({
        opacity: 1,
    }, {
        step: function(now, fx) {
            $(this).css('transform', 'scale(' + now + ')')
        },
        duration: 200
    })

    $("#modal-container").html(`
        <div class="modal">
                <div class="thumb">
                    <img src="${project.thumb || "/assets/thumb.png"}">
                    <div class="overlay"></div>
                </div>
                <div class="text">
                    <h1>${project.name}</h1>
                    <p>${project.description}</p>
                    ${project.url ? `<a href='${project.url.url}' target='_blank'>${project.url.label || "Link"}</a>` : ""}
                </div>

                <div class="tags">
                ${project.tags.map((t) => `<span>${t}</span>`).join("")}
                </div>
            </div>
        </div>
    `)
}

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