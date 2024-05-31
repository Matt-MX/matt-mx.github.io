$(function () {
    let visible = true
    let objs = []
    let active = false
    let speed = 0.1
    let score = 0

    function actionJump() {
        // todo start if not started already
        if (!visible) return
        if (!active) {
            startGame()
        }

        if ($("#runner-player").hasClass("jump")) return;
        $("#runner-player").addClass("jump")
        setTimeout(() => {
            $("#runner-player").removeClass("jump")
        }, 700)
    }

    function populateObjects() {
        objs = []
        $("#runner-objects").empty()
        $("#runner-objects").append(`
            <div class="obj" style="width: 2rem; height: 2rem;"></div>
        `)
        const last = $("#runner-objects").children(":last-child").get(0)
        objs.push(last)
    }

    function moveObjects() {
        populateObjects()
        $("#runner-objects").animate({
            left: "-200rem"
        }, {
            duration: 1000 * (1 / speed),
            easing: "linear",
            complete: function () {
                $(this).css({ left: "100%" })
                console.log("test")
                if (active) {
                    speed += 0.1
                    $("#runner-game-speed").text(`${speed * 100}%`)
                    moveObjects()
                }
            }
        })
    }

    $("#runner-game").click(function (event) {
        actionJump()
    })

    $("body").keyup(function (event) {
        if (event.which == 32) {
            actionJump()
        }
    })

    const setScore = (newScore) => {
        score = newScore
        $("#runner-game-score").text(`${newScore}m`)
    }

    const playerObject = $("#runner-player").get(0)

    const intersect = (a, b) =>
    (
        a.bottom > b.top
        && a.left + (a.right - a.left) * 0.5 > b.left
        && a.top < b.bottom
        && a.left < b.right
    )

    let i = 0
    const loop = (delta) => {
        let gameOver = false
        i++

        if (i >= 100) {
            i = 0
            setScore(score + (1 / speed))
        }

        for (let i = 0; i < objs.length; i++) {
            const obj = objs[i]

            if (intersect(obj.getBoundingClientRect(), playerObject.getBoundingClientRect())) {
                gameOver = true
                break;
            }
        }

        if (gameOver) {
            stopGame()
        } else {
            window.requestAnimationFrame(loop)
        }
    }

    function startGame() {
        active = true
        window.requestAnimationFrame(loop)
        moveObjects()
    }

    function stopGame() {
        active = false
        console.log("GAME OVER!")
    }
})