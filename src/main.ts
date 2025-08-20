import { Loop, TouchMouse } from './loop_input';
import './style.css'
import { lerp, type XY, type XYWH } from './util';

const w = 1920
const h = 1080
const hw = w / 2
const hh = h / 2

let t: number
let cursor_bg_speed: number
let cursor_bg_speed_lerping: number
let cursor_box0: XY
let cursor_box: XYWH
let cursor_down: XY | undefined
let cursor_up: XY | undefined

let is_intro: boolean

let white: Card[]
let black: Card[]

function _init() {

    t = 0

    is_intro = false

    cursor_box0 = [hw, hh]
    cursor_box = [hw, hh, 16, 16]
    cursor_down = undefined
    cursor_up = undefined
    cursor_bg_speed = 1
    cursor_bg_speed_lerping = 1

    reset_cards()

}

function reset_cards() {
    let cw = 228
    let ch = 280

    black = [
        {
            color: colors.black,
            role: 'king',
            box: [a + 40, b + 30, cw, ch]
        },
        {
            color: colors.black,
            role: 'pawn',
            box: [a + 40 + 1 * (aw - 60) / 6, b + 30, cw, ch]
        },
        {
            color: colors.black,
            role: 'knight',
            box: [a + 40 + 2 * (aw - 60) / 6, b + 30, cw, ch]
        },
        {
            color: colors.black,
            role: 'bishop',
            box: [a + 40 + 3 * (aw - 60) / 6, b + 30, cw, ch]
        },
        {
            color: colors.black,
            role: 'queen',
            box: [a + 40 + 4 * (aw - 60) / 6, b + 30, cw, ch]
        },
        {
            color: colors.black,
            role: 'rook',
            box: [a + 40 + 5 * (aw - 60) / 6, b + 30, cw, ch]
        },
    ]
    white = [
        {
            color: colors.white,
            role: 'king',
            box: [a + 40, b2 - 30 - ch, cw, ch]
        },
        {
            color: colors.white,
            role: 'pawn',
            box: [a + 40 + 1 * (aw - 60) / 6, b2 - 30 - ch, cw, ch]
        },
        {
            color: colors.white,
            role: 'knight',
            box: [a + 40 + 2 * (aw - 60) / 6, b2 - 30 - ch, cw, ch]
        },
        {
            color: colors.white,
            role: 'bishop',
            box: [a + 40 + 3 * (aw - 60) / 6, b2 - 30 - ch, cw, ch]
        },
        {
            color: colors.white,
            role: 'queen',
            box: [a + 40 + 4 * (aw - 60) / 6, b2 - 30 - ch, cw, ch]
        },
        {
            color: colors.white,
            role: 'rook',
            box: [a + 40 + 5 * (aw - 60) / 6, b2 - 30 - ch, cw, ch]
        },
    ]
}

let a = 30
let b = 30
let a2 = 1560
let b2 = 700
let hb = b + (b2 - b) / 2
let aw = (a2 - a)

type Card = {
    color: Color
    role: Role
    box: XYWH
}

function _update(dt: number) {
    t += dt

    if (cursor_down) {
        cursor_bg_speed = 0.3
    } else {

        cursor_bg_speed = 1
    }
    if (cursor_up) {

        if (is_intro) {
            is_intro = false
        }
    }


    let cursor_has_moved = cursor_box[0] !== cursor_box0[0] || cursor_box[1] !== cursor_box0[1]
    if (cursor_has_moved) {
        cursor_bg_speed = 0.8
    }

    cursor_bg_speed_lerping = lerp(cursor_bg_speed_lerping, cursor_bg_speed, 0.001)
}

function _render() {
    cx.clearRect(0, 0, 1920, 1080)
    if (is_intro) {
        render_intro()
    } else {
        render_gameplay()
    }
    let float_x = Math.sin(t * 0.001) * 8
    let float_y = Math.cos(t * 0.002) * 4


    round_bg(cursor_box[0] + 45 + float_x, cursor_box[1] + 45 + float_y, cursor_down === undefined ? 70 : 67, cursor_down === undefined ? colors.white: colors.yellow, cursor_bg_speed_lerping)
    cursor(cursor_box[0], cursor_box[1])
}

function render_gameplay() {
    cx.fillStyle = colors.darkblue
    cx.fillRect(0, 0, 1920, 1080)

    let b_color = colors.black
    render_borders(a, b, a2, b2, b_color)

    sketch_horiz(a + 200, b, a2 - 200, { skew: 10, color: b_color })
    sketch_horiz(a + 200, b2, a2 - 200, { skew: -10, color: b_color })
    sketch_horiz(a + 110, hb, a2 - 100, { skew: 0, color: b_color })

    rect(a2 + 40, b, 300, 300, colors.black)
    rect(a2 + 40, b2 - 310, 300, 300, colors.black)

    for (let i = 0; i < 6; i++) {
        render_card(white[i], 'Home', 'Fianchetto')
        render_card(black[i], 'Home')
    }

    render_evals()

}

function render_evals() {

    eval_bar(200, hb - 12)
}

function eval_bar(x: number, y: number) {
    rect(x, y, 400, 24, colors.darkred)
}

function render_borders(a: number, b: number, a2: number, b2: number, color: Color) {
    let opts = {color}
    line(a + 70, b, a + 70 + 100, b, opts)
    line(a, b + 70, a, b + 70 + 100, opts)
    circ(a + 70, b, 12, color)
    circ(a, b + 70, 12, color)


    line(a2 - 70, b, a2 - 70 - 100, b, opts)
    line(a2, b + 70, a2, b + 70 + 100, opts)
    circ(a2 - 70, b, 12, color)
    circ(a2, b + 70, 12, color)

    line(a + 70, b2, a + 70 + 100, b2, opts)
    line(a, b2 - 70, a, b2 - 70 - 100, opts)
    circ(a + 70, b2, 12, color)
    circ(a, b2 - 70, 12, color)

    line(a2 - 70, b2, a2 - 70 - 100, b2, opts)
    line(a2, b2 - 70, a2, b2 - 70 - 100, opts)
    circ(a2 - 70, b2, 12, color)
    circ(a2, b2 - 70, 12, color)


    line(a, hb - 40, a, hb + 40, opts)
    line(a, hb, a + 70, hb, opts)
    circ(a, hb - 40, 12, color)
    circ(a, hb + 40, 12, color)

    line(a2, hb - 40, a2, hb + 40, opts)
    line(a2, hb, a2 - 70, hb, opts)
    circ(a2, hb - 40, 12, color)
    circ(a2, hb + 40, 12, color)
}

function render_card(card: Card, text1: string, text2?: string, _text3?: string) {
    let { color, role, box: [x, y, w, h] } = card
    rect(x - 4, y - 4, w + 8, h + 8, colors.lightgray)
    rect(x - 1, y - 1, w + 2, h + 2, colors.black)
    rect(x, y, w, h, colors.purple)

    //round_bg(x + 230 / 2, y + 10 + 70, 100, color)

    piece(paths[role], x + 230 / 2 - 70, y + 10, 140, { color })

    if (text2) {
        text(text1, x + 20, y + 180, 30, { shadow: 2 })
        text(text2, x + 20, y + 230, 30, { shadow: 2 })
    } else {

        text(text1, x + 20, y + 220, 30, { shadow: 2 })
    }
}


type Role = 'king' | 'bishop' | 'rook' | 'queen' | 'knight' | 'pawn'

type LineOptions = {
    color?: Color
    width?: number
}

function rect(x: number, y: number, w: number, h: number, color: Color) {
    cx.fillStyle = color
    cx.fillRect(x, y, w, h)
}

function circ(x: number, y: number, radius: number, color?: Color) {
    cx.fillStyle = color ?? colors.black
    cx.beginPath()
    cx.arc(x, y, radius, 0, PI2)
    cx.fill()
}

function line(x: number, y: number, x2: number, y2: number, opts: LineOptions = {}) {
    cx.strokeStyle = opts.color ?? colors.black
    cx.lineWidth = opts.width ?? 7
    cx.beginPath()
    cx.moveTo(x, y)
    cx.lineTo(x2, y2)
    cx.stroke()
}

type SketchLineOptions = LineOptions & {
    skew?: number
}

function sketch_horiz(x: number, y: number, x2: number, opts: SketchLineOptions = {}) {
    cx.strokeStyle = opts.color ?? colors.black
    cx.lineWidth = opts.width ?? 7

    let skew = opts.skew ?? 0
    cx.beginPath()
    let m = x + (x2 - x) / 2
    for (let i = x; i <= x2; i += Math.abs(i - m) / m * 100 + 20) {
        let a = i
        cx.moveTo(a, y - 10)
        cx.lineTo(a + skew, y + 10)
    }
    cx.stroke()
}

function render_intro() {

    cx.fillStyle = colors.gray
    cx.fillRect(0, 0, 1920, 1080)



    let float_theta = Math.sin(t * 0.001) * 0.1
    let float_x = Math.sin(t * 0.001) * 8
    let float_y = Math.cos(t * 0.002) * 4


    round_bg(300 + float_x, 500 + float_y, 200, colors.blue)
    round_bg(700 + float_x, 500 + float_y, 200, colors.darkred)
    round_bg(950 + float_x, 750 + float_y, 300, colors.orange)

    piece(paths.king, 200 + float_x, 400 + float_y, 200, { theta: 0.2 + float_theta })
    piece(paths.bishop, 600 + float_x, 400 + float_y, 200, { theta: 0.2 + float_theta })
    piece(paths.knight, 800 + float_x, 600 + float_y, 300, { theta: 0.2 + float_theta })
    piece(paths.pawn, 1000, 300, 800)


    text(`~[${colors.purple}]Mor[/] Chess [${colors.red}]2[/]~`, 380, 300, 180, { bold: true, gap: -4, outline: 18, wave: 8 })
    text(`An [${colors.darkred}]Abstract[/], [${colors.gray}]shapeless[/] Form of Chess`, 260, 400, 80, { bold: true, shadow: 4, wave: 4 })

    text(`by [${colors.blue}]eguneys`, 100, 800, 60, { shadow: 2, wave: 2 })

    text(`click anywhere to begin`, 100, 900, 60, { shadow: 2, wave: 1 })

}

function round_bg(x: number, y: number, radius: number, color: Color, speed = 1) {
    cx.save()
    cx.beginPath()
    cx.arc(x, y, radius, 0, Math.PI * 2)
    cx.closePath()
    cx.clip()


    cx.fillStyle = color
    let grid_spacing = radius * 0.2

    let a = (t * 0.02 * speed) % grid_spacing
    for (let i = -100; i < 200; i++) {
        for (let j = -100; j < 200; j++) {
            let _x = i * grid_spacing
            let _y = j * grid_spacing

            _x -= a
            _y -= a

            let dist_from_center = Math.sqrt((_x - x) ** 2 + (_y - y) ** 2)
            let normalized_dist = dist_from_center / radius
            let _radius = grid_spacing * 0.5 * Math.pow(1.0 - normalized_dist, 1.8)

            _radius = Math.max(1, _radius * 3)

            _x += _radius * 2

            if (_radius === 1) {
                continue
            }

            cx.beginPath()
            //cx.fillRect(_x - _radius / 2, _y - _radius / 2, _radius, _radius)
            cx.arc(_x - _radius /2 , _y - _radius / 2, _radius, 0, PI2)
            cx.fill()
        }
    }
    cx.restore()


}

const PI = Math.PI
const PI2 = PI * 2

type Color = string

type PieceOptions = {
    theta?: number
    color?: Color
}

function piece(path: Path2D, x: number, y: number, size: number, opts: PieceOptions = {}) {
    let scale = size / 50
    cx.fillStyle = opts.color ?? colors.black
    cx.save()
    cx.translate(x, y)
    if (opts.theta) {
        cx.translate(size / 2, size/2)
        cx.rotate(opts.theta)
        cx.translate(-size/2, -size/2)
    }
    cx.scale(scale, scale)
    cx.fill(path)

    cx.strokeStyle=  opts.color === colors.black ? colors.white : colors.black
    cx.lineWidth = 1
    cx.stroke(path)

    cx.restore()
}

function cursor(x: number, y: number, size: number = 80) {
    let scale = size / 266

    cx.save()
    cx.translate(x, y)
    cx.scale(scale, scale)
    cx.fillStyle = colors.blue
    cx.fill(paths.cursor)

    cx.strokeStyle = 'white'
    cx.lineWidth = 9
    cx.stroke(paths.cursor)
    cx.restore()
}

const paths = {
    cursor: new Path2D(`m 150.036,266.494
c -0.264,0 -0.517,-0.006 -0.792,-0.018 -6.102,-0.337 -11.332,-4.474 -13.046,-10.347
L 110.131,167.102 14.928,148.235
C 8.914,147.041 4.314,142.176 3.452,136.112 2.594,130.05 5.653,124.096 11.102,121.28
L 242.143,1.617
c 5.357,-2.792 11.914,-1.907 16.375,2.183 4.474,4.101 5.885,10.55 3.562,16.146
l -98.743,237.655
c -2.24,5.417 -7.501,8.893 -13.301,8.893
z`),
    pawn: new Path2D(`M 25 46.448
H 11.606
a 13.139 13.139 0 0 1-.99-5.043
c 0-2.975.863-5.644 2.598-8.018 1.736-2.365 3.971-4.054 6.697-5.067
a 6.824 6.824 0 0 1-2.861-2.398
c -.737-1.071-1.1-2.283-1.1-3.634 0-1.69.575-3.156 1.735-4.392 1.151-1.244 2.574-1.961 4.267-2.15-1.346-.981-2.015-2.283-2.015-3.89 0-1.351.491-2.513 1.482-3.477.982-.964 2.176-1.442 3.581-1.442 1.389 0 2.582.478 3.573 1.442
s 1.49 2.126 1.49 3.477
c 0 1.607-.669 2.909-2.015 3.89 1.693.189 3.116.906 4.267 2.15 1.16 1.236 1.736 2.703 1.736 4.392 0 1.351-.373 2.563-1.126 3.634
a 7.036 7.036 0 0 1-2.862 2.398
c 2.726 1.013 4.962 2.702 6.697 5.067 1.736 2.374 2.6 5.043 2.6 8.018 0 1.739-.322 3.42-.966 5.043
z`),
    queen: new Path2D(`M 24.95 10.752
c -.94 0-1.745-.33-2.397-.99-.652-.66-.974-1.465-.974-2.405 0-.931.322-1.727.974-2.387.652-.66 1.456-.99 2.396-.99.923 0 1.727.33 2.396.99
a 3.23 3.23 0 0 1 1 2.387
c 0 .94-.33 1.744-1 2.405-.669.66-1.473.99-2.396.99
z

m 15.281 33.19
c -.812.71-2.633 1.304-5.46 1.786-2.828.474-6.088.72-9.771.72-3.75 0-7.053-.254-9.898-.745-2.844-.5-4.64-1.118-5.384-1.863
l 1.566-5.952-.694-3.895
L 8.405 30.2 6.297 14.774
l 1.21-.474 6.8 11.455.152-13.64 1.685-.296 5.182 13.716 2.776-14.757
h 1.72
l 2.776 14.706
L 33.73 11.82
l 1.71.296.153 13.64 6.824-11.48 1.16.541-2.058 15.359-2.21 3.793-.694 3.945
z

M 14.535 11.989
c -.948 0-1.752-.322-2.413-.974-.66-.652-.99-1.456-.99-2.396 0-.923.33-1.719.99-2.38
s 1.465-.99 2.413-.99
c .923 0 1.719.33 2.38.99
s .99 1.457.99 2.38
c 0 .94-.33 1.744-.99 2.396
a 3.266 3.266 0 0 1-2.38.974
z

m 20.828 0
c -.94 0-1.736-.322-2.387-.974-.652-.652-.982-1.456-.982-2.396 0-.923.33-1.719.982-2.38
s 1.447-.99 2.387-.99
c .948 0 1.753.33 2.413.99
s .99 1.457.99 2.38
c 0 .94-.33 1.744-.99 2.396-.66.652-1.465.974-2.413.974
z

M 5.4 14.723
c -.94 0-1.736-.33-2.388-.982-.652-.652-.982-1.448-.982-2.396 0-.923.33-1.719.982-2.388
C 3.664 8.28 4.46 7.95 5.4 7.95
c .948 0 1.744.33 2.413 1.007.66.67.99 1.465.99 2.388 0 .948-.33 1.744-.99 2.396
a 3.323 3.323 0 0 1-2.413.982
z

m 39.141 0
c -.94 0-1.744-.33-2.404-.982-.66-.652-.991-1.448-.991-2.396 0-.923.33-1.719.99-2.388.66-.677 1.465-1.007 2.405-1.007.931 0 1.727.33 2.388 1.007.66.67.99 1.465.99 2.388 0 .948-.33 1.744-.99 2.396
a 3.28 3.28 0 0 1-2.388.982
z`),
    rook: new Path2D(`M 28.408 9.22
h 4.216
V 5.825
h 6.799
v 9.296
l -5.503 4.242
v 11.862
l 4.216 4.216
v 5.08
h 3.793
v 5.927
H 8.071
V 40.52
h 3.793
v -5.08
l 4.242-4.216
V 19.363
l -5.504-4.242
V 5.825
h 6.774
V 9.22
h 4.242
V 5.825
h 6.79
z`),
    king: new Path2D(`M 25.821 12.022
h -1.76
v -3.25
h -2.067
c -.558 0-.838-.272-.838-.822
v -.025
c 0-.542.28-.813.838-.813
h 2.066
V 5.004
c 0-.585.297-.872.89-.872.575 0 .871.287.871.872
v 2.108
h 2.134
c .542 0 .813.27.813.813
v .025
c 0 .55-.271.821-.813.821
l -2.117.026
z

M 11.03 37.744
l -.813-4.64
c -.017 0-.042-.033-.076-.101-.085-.119-.322-.271-.711-.457-.381-.195-.838-.517-1.346-.982
a 41.99 41.99 0 0 1-1.702-1.49 8.509 8.509 0 0 1-1.1-1.237
C 4.273 27.45 3.705 25.772 3.595 23.8
c -.17-1.897.601-3.794 2.303-5.682 1.719-1.88 4.047-2.768 6.968-2.65 1.092.068 2.38.33 3.844.796.483.195.974.39 1.482.576
l 1.498.584
c .263.136.5.271.695.398
a 4.38 4.38 0 0 1-.127-1.041
c 0-1.287.457-2.388 1.38-3.302.914-.906 2.023-1.372 3.31-1.389 1.287 0 2.388.466 3.302 1.38.906.915 1.363 2.015 1.363 3.285 0 .263-.034.61-.101 1.042.228-.144.457-.271.669-.373.762-.33 1.76-.72 3.005-1.16 1.423-.482 2.701-.753 3.844-.821 2.921-.136 5.241.753 6.943 2.65 1.668 1.888 2.447 3.785 2.328 5.681-.127 1.973-.703 3.65-1.71 5.038-.33.449-.703.863-1.118 1.253
a 40.5 40.5 0 0 1-1.66 1.473
c -.541.466-1.007.796-1.388.982-.38.186-.6.347-.669.457
a .294.294 0 0 1-.05.077
c -.017.017-.026.034-.026.05
l -.796 4.666 1.643 6.121
c -.83.745-2.684 1.355-5.554 1.837-2.879.483-6.206.72-9.974.72-3.835 0-7.214-.254-10.118-.754-2.912-.508-4.741-1.143-5.486-1.896
z`),
    bishop: new Path2D(`M 25 42.162
c -.229.94-.516 1.592-.847 1.956-.33.364-.762.745-1.312 1.143-.593.415-1.295.762-2.108 1.05-.813.288-1.71.364-2.701.211
l -6.968-.965
a 2.858 2.858 0 0 0-.762 0
c -.22.034-.432.051-.635.051-.347 0-.787.076-1.32.237-.543.153-.958.381-1.254.677
l -2.405-3.945
c .297-.33.56-.559.788-.694.237-.127.508-.271.821-.415
a 9.179 9.179 0 0 1 3.073-.821
c .466-.034.923-.043 1.364-.026
a 9.8 9.8 0 0 0 1.397-.05
c .889.152 1.786.287 2.684.406.905.127 1.811.254 2.717.39.991 0 1.66-.102 2.007-.297.186-.102.474-.288.872-.55.398-.263.796-.652 1.194-1.169-.88-.093-1.77-.262-2.684-.508
a 24.094 24.094 0 0 1-2.405-.753
l 2.583-6.401
c -1.296-.745-2.193-1.338-2.71-1.795
a 5.3 5.3 0 0 1-1.21-1.575
c -.432-.762-.712-1.498-.83-2.21
a 9.341 9.341 0 0 1-.16-1.913
c .016-.99.245-2.083.702-3.285.457-1.194 1.312-2.27 2.565-3.209
a 79.091 79.091 0 0 0 3.057-2.455 27.746 27.746 0 0 0 2.946-2.955
c -1.22-.627-1.829-1.626-1.829-2.997 0-.932.322-1.72.974-2.388.652-.66 1.456-.99 2.396-.99.923 0 1.719.33 2.38.99.66.669.99 1.456.99 2.388 0 1.354-.61 2.353-1.83 2.997
a 26.796 26.796 0 0 0 2.914 2.955 56.74 56.74 0 0 0 3.09 2.455
c 1.236.94 2.083 2.015 2.523 3.209.449 1.202.694 2.294.72 3.285 0 .567-.051 1.202-.17 1.913
s -.38 1.448-.796 2.21
a 6.084 6.084 0 0 1-1.253 1.575
c -.5.457-1.388 1.05-2.667 1.795
l 2.583 6.4
c -.729.263-1.55.517-2.456.754-.914.246-1.786.415-2.633.508.381.517.77.906 1.168 1.169.398.262.695.448.898.55.347.195 1.016.296 2.007.296
a 263.35 263.35 0 0 1 2.692-.39 81.13 81.13 0 0 0 2.718-.406
c .44.051.889.068 1.346.051
a 13.12 13.12 0 0 1 1.405.026 9.627 9.627 0 0 1 3.074.82
c .296.145.567.289.804.416.246.135.508.364.804.694
l -2.43 3.945
c -.296-.296-.71-.524-1.253-.677-.533-.16-.965-.237-1.295-.237-.22 0-.44-.017-.66-.05
a 2.794 2.794 0 0 0-.754 0
l -6.95.964
c -.992.153-1.914.085-2.761-.194-.855-.28-1.558-.652-2.1-1.118-.542-.449-.982-.83-1.304-1.151-.321-.322-.592-.957-.804-1.897
z`),
    knight: new Path2D(`M 26.178 9.395
c 2.6.17 5.004.838 7.222 2.015 2.21 1.169 4.098 2.676 5.656 4.513 1.092 1.287 2.117 2.845 3.082 4.665
a 28.684 28.684 0 0 1 2.32 5.774 36.511 36.511 0 0 1 1.253 7.46
c .177 2.599.262 5.012.262 7.23
v 5.402
H 15.468
c -.153 0-.22-.407-.212-1.21.009-.814.06-1.466.16-1.965.06-.398.221-.957.467-1.685.254-.728.66-1.609 1.244-2.65.263-.534.89-1.304 1.88-2.32.999-1.016 2.133-2.201 3.429-3.539.745-.762 1.32-1.719 1.744-2.879.423-1.151.601-2.201.533-3.15
a 8.37 8.37 0 0 1-2.006 1.22
c -3.505 1.253-6.045 3.073-7.612 5.452-.118.153-.49.822-1.117 2.015-.33.627-.618 1.059-.847 1.287-.313.314-.77.491-1.363.525-.923.043-1.643-.398-2.16-1.346-.693.203-1.312.288-1.862.254-.923-.347-1.592-.72-2.006-1.117-.847-.847-1.389-1.685-1.651-2.532
a 9.43 9.43 0 0 1-.381-2.726
c 0-1.389.855-3.226 2.582-5.512 2.015-2.625 3.09-4.631 3.217-6.003 0-.593.06-1.261.178-2.007
a 4.198 4.198 0 0 1 .618-1.49
c .22-.33.364-.558.432-.677.076-.127.212-.313.415-.559.144-.203.27-.355.372-.457.093-.11.22-.254.373-.44.178-.212.406-.457.694-.745
a 18.06 18.06 0 0 1-1.067-7.46
c 3.285 1.169 6.054 3.015 8.28 5.53.551-1.872 1.626-3.387 3.226-4.539 1.321.923 2.371 2.15 3.15 3.666
z`)
}


const colors = {
    black: '#000000',
    darkblue: '#1D2B53',
    darkred: '#7E2553',
    darkgreen: '#008751',
    brown: '#AB5236',
    gray: '#5F574F',
    lightgray: '#C2C3C7',
    white: '#FFF1E8',
    red: '#FF004D',
    orange: '#FFA300',
    yellow: '#FFEC27',
    green: '#00E436',
    blue: '#29ADFF',
    purple: '#83769C',
    pink: '#FF77A8',
    sand: '#FFCCAA',
}


type TextOptions = {
    wave?: number
    bold?: boolean
    gap?: number
    outline?: number
    shadow?: number
}

function text(text: string, x: number, y: number, px: number, opts: TextOptions = {}) {

    let bold = opts.bold ? 'bold ' : ''
    const a = (i: number) => Math.sin(t * 0.01 + i * Math.PI * 2 * 0.2 * text.length / 50) * (opts.wave ?? 0)
    cx.font = `${bold}${px}px arial`

    let color: string | undefined = undefined
    let gap = opts.gap ?? 0

    for (let i = 0; i < text.length; i++) {
        if (text[i] === '[') {
            let c_res = ''
            while (text[i] !== ']') {
                i++
                if (text[i] !== ']') {
                    c_res += text[i]
                }
            }
            i++
            if (color) {
                color = undefined
            } else {
                color = c_res
            }
        }
        if (text[i] === undefined) {
            break
        }

        if (opts.outline) {
            cx.lineJoin = 'round'
            cx.lineWidth = opts.outline
            cx.strokeStyle = colors.black
            cx.strokeText(text[i], x, y + a(i))
        }

        if (opts.shadow) {
            cx.fillStyle = colors.black
            cx.fillText(text[i], x - opts.shadow, y + opts.shadow + a(i))
        }

        cx.fillStyle = color ? color : colors.white
        cx.fillText(text[i], x, y + a(i))
        x += cx.measureText(text[i]).width + gap

    }
}

let cx: CanvasRenderingContext2D

function init_canvas() {

    let canvas = document.createElement('canvas')

    canvas.width = 1920
    canvas.height = 1080

    cx = canvas.getContext('2d')!

    return canvas
}

function app(el: HTMLElement) {

    let canvas = init_canvas()
    let $ = document.createElement('content')
    $.classList.add('content')
    $.appendChild(canvas)
    el.appendChild($)

    _init()

    TouchMouse(canvas, {
        on_up: function (n: XY): void {
            cursor_down = undefined
            cursor_up = n
        },
        on_down: function (n: XY): void {
            cursor_down = n
        },
        on_move: function (n: XY): void {
            cursor_box[0] = n[0] * 1920
            cursor_box[1] = n[1] * 1080
        }
    })

    Loop(_update, _render, () => {
        cursor_up = undefined
        cursor_box0 = [cursor_box[0], cursor_box[1]]
    })
}


app(document.getElementById('app')!)
