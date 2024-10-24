$(function () {
    let visible = true
    let objs = []
    let active = false
    let speed = 1
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
        }, 500)
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function populateObjects() {
        objs = []
        $("#runner-objects").empty()

        let nextBox = 0
        let max = rand(30, 100)
        for (let i = 0; i < max; i++) {
            if (nextBox == 0) {
                $("#runner-objects").append(`
                    <div class="obj" style="width: 2rem; height: 2rem;"></div>
                `)
                nextBox = rand(30, max - i)
            } else {
                $("#runner-objects").append(`
                    <div style="width: 2rem;"></div>
                `)
                nextBox--
            }
        }
        const last = $("#runner-objects").children(".obj").toArray()
        for (let obj of last) {
            objs.push(obj)
        }
    }

    function moveObjects() {
        populateObjects()
        const dur = Math.max(300, 5000 - speed * 100)
        $("#runner-objects").animate({
            left: "200rem"
        }, {
            duration: dur,
            easing: "linear",
            complete: function () {
                $(this).css({ left: "-200rem" })
                if (active) {
                    speed += 1
                    $("#runner-game-speed").text(`${speed * 100}%`)
                    moveObjects()
                }
            }
        })
        $("#runner-game-sky").animate({
            'background-position-x': '-100%'
        }, {
            duration: dur * 1.5,
            easing: "linear",
            complete: function () {
                $(this).css({
                    'background-position-x': '100%'
                })
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

        if (i >= 10) {
            i = 0
            setScore(score + speed)
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

    function setText(html) {
        const text = $("#runner-game-text")
        text.empty()
        text.html(html)
    }

    function startGame() {
        active = true
        window.requestAnimationFrame(loop)
        speed = 1
        $("#runner-game-speed").text(`${speed * 100}%`)
        score = 0
        moveObjects()
        setText(`<h2>Click to jump! Avoid the obstacles!</h2>`)
        $("#runner-player-z").hide()
        $("#runner-player").removeClass("fallen")
        $("#runner-player").addClass("active")
        $("#runner-player-stars").hide()
    }

    function stopGame() {
        active = false

        $("#runner-player-z").show()
        $("#runner-player").removeClass("active")
        setTimeout(() => {
            $("#runner-player").addClass("fallen")
        }, 1)
        $("#runner-player-stars").show()
        $("#runner-objects").empty()

        setText(`
            <h1>Game over!</h1>
            <h2>Click to start again!</h2>
        `)
    }
})