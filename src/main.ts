import { Loop, TouchMouse } from './loop_input';
import './style.css'
import { appr, box_intersect, type XY, type XYWH } from './util';
import { play, sounds } from './play_sounds'
import { card_choices as _card_choices, cards, prop_string, type Card, type Cards } from './chess_logic'
import { bishop, black, king, knight, pawn, queen, rook, white, type Property } from './choices';
import { arr_shuffle } from './random';

const card_choices = (c: Card) => {
    if (!c.choices) {
        c.choices = _card_choices(c, cc.cards.filter(a => a.c === c.c))
    }
    return c.choices
}


export function ai_play(cc: Cards) {

    let bb = cc.cards.filter(_ => _.c === black)

    let card = arr_shuffle(bb)[0]
    let ccc = card_choices(card)

    if (ccc === undefined || ccc.length === 0) {

    } else {
        prop_changes.push([card, arr_shuffle(ccc)[0]])
        t_prop_change = 1000
    }

}

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

let cc: Cards

let selected_card: Card | undefined
let hovering_prop: number
let selected_prop: number
let t_select: number

type PropChange = [Card, Property]

let prop_changes: PropChange[]
let t_prop_change: number

let t_ai_think: number
let t_begin: number

function _init() {

    t_begin = 0
    t_ai_think = 0

    prop_changes = []
    t_prop_change = 0

    cc = cards()
    selected_card = undefined
    hovering_prop = -1
    selected_prop = -1
    t_select = 0

    t = 0

    is_intro = false

    cursor_box0 = [hw, hh]
    cursor_box = [hw, hh, 16, 16]
    cursor_down = undefined
    cursor_up = undefined
    cursor_bg_speed = 1
    cursor_bg_speed_lerping = 1
}


function _update(dt: number) {

    t += dt

    if (t_select > 0) {
        t_select -= dt
        if (t_select < 0) {
            t_select = 0

            selected_card = undefined
            selected_prop = -1
        }
    }

    if (t_prop_change > 0) {
        t_prop_change -= dt
        if (t_prop_change < 0) {
            t_prop_change = 0

            prop_changes.forEach(c => {
                c[0].p = c[1]
                c[0].choices = undefined
            })

            prop_changes = []

            end_turn()
        }
    }

    t_begin += dt

    if (cc.turn === black) {
        if (t_ai_think > 0) {
            t_ai_think -= dt
            if (t_ai_think <= 0) {
                ai_play(cc)
            }
        }
    }


    if (cursor_down) {
        cursor_bg_speed = 0.3
    } else {

        cursor_bg_speed = 0.6
    }
    if (cursor_up) {

        if (is_intro) {
            is_intro = false
        }

        if (selected_card !== undefined) {
            let pp = card_choices(selected_card)

            if (pp !== undefined) {
                for (let i = 0; i < pp.length; i++) {
                    if (box_intersect(c_text_xy(selected_card, i, pp.length), cursor_box)) {
                        play(sounds.click)
                        selected_prop = i
                        t_select = 200

                        let cc: PropChange = [selected_card!, card_choices(selected_card!)![selected_prop]]
                        prop_changes.push(cc)
                        t_prop_change = 800
                    }
                }
            }
        }


    }

    for (let c of cc.cards) {
        if (t_begin < 5000 || cc.turn === black || c.c === black) {
            continue
        }
        if (box_intersect(card_box(c), cursor_box)) {
            if (selected_card !== c) {
                play(sounds.ring)
            }
            selected_card = c
        }
    }



    hovering_prop = -1
    if (selected_card !== undefined) {
        let pp = card_choices(selected_card)

        if (pp !== undefined) {
            for (let i = 0; i < pp.length; i++) {
                if (box_intersect(c_text_xy(selected_card, i, pp.length), cursor_box)) {
                    hovering_prop = i
                }
            }
        }
    }


    let cursor_has_moved = cursor_box[0] !== cursor_box0[0] || cursor_box[1] !== cursor_box0[1]
    if (cursor_has_moved) {
        cursor_bg_speed = 0.4
    }

    cursor_bg_speed_lerping = appr(cursor_bg_speed_lerping, cursor_bg_speed, 0.001)
    if (i++ % 100 === 0) {
        //console.log(cursor_bg_speed_lerping)
    }

    for (let c of cc.cards) {
        update_card(c, dt)

    }
}
let i = 0


function end_turn() {
    cc.turn = cc.turn === black ? white : black

    if (cc.turn === black) {
        t_ai_think = 1000 + Math.random() * 2000
    }
}


function update_card(c: Card, _dt: number) {
    if (selected_card === c) {
        if (selected_prop) {

        }
    }
}

function _render() {
    cx.clearRect(0, 0, 1920, 1080)
    if (is_intro) {
        render_intro()
    } else {
        render_gameplay2()
    }
    let float_x = Math.sin(t * 0.001) * 8
    let float_y = Math.cos(t * 0.002) * 4


    round_bg(cursor_box[0] + 45 + float_x, cursor_box[1] + 45 + float_y, cursor_down === undefined ? 70 : 67, cursor_down === undefined ? colors.white: colors.yellow, cursor_bg_speed_lerping)
    cursor(cursor_box[0], cursor_box[1])
}

function render_gameplay2() {
    for (let c of cc.cards) {
        render_card(c)
    }

    if (t_begin < 5000) {
        render_begin()
    } else if (cc.turn === white) {
        render_my_turn()
    } else {
        render_ai_turn()
    }
}

function render_begin() {
    let a = Math.sin(t * 0.002) * 8
    if (t_begin < 2000) {
        text(`[${colors.yellow}]3[/] [${colors.red}]2[/] [${colors.green}]1[/]...`, 712 - a, 1000, 140, { gap: 4 + Math.sin(t * 0.002) * 2, outline: 6, wave: 6 })
    } else {
        text(`Let's play [${colors.blue}]chess!`, 312 - a, 1000, 140, { gap: 4 + Math.sin(t * 0.002) * 2, outline: 6, wave: 6 })
    }
}

function render_ai_turn() {
    let a = Math.sin(t * 0.002) * 8
    text(`[${colors.black}]Cat[/]'[${colors.black}]s[/] Turn`, 512 - a, 1000, 140, { gap: 12, outline: 6, wave: 6 })
}

function render_my_turn() {

    let a = Math.sin(t * 0.002) * 8
    text(`[${colors.yellow}]Select a[/] [${colors.white}]piece action[/] [${colors.yellow}]to play[/]`, 112 + a, 800, 110, { gap: 12, outline: 20, wave: 2 })
    text(`Your Turn`, 512 - a, 1000, 140, { gap: 12, outline: 20, wave: 1 })

}

function card_box(c: Card): XYWH {
    return [c.pos[0], c.pos[1], 280, 280]
}


function render_card(c: Card) {

    let is_selected = selected_card === c

    let color = c.c === white ? colors.white : colors.black
    let [x, y] = c.pos
    x += 100
    y += 100

    if (is_selected) {
        round_bg(x + 30, y + 100, 230, role_to_color[c.r])
    }

    let _x = x + Math.sin(t * 0.002 - c.r * 0.4 + c.c * Math.PI * 1) * 8
    let _y = y +Math.cos(t * 0.002 - c.r * 0.2 + c.c * Math.PI * 1) * 8
    piece(role_to_path[c.r], _x, _y, 180, { color: color })


    let prop_change = prop_changes.find(_ => _[0] === c)

    if (prop_change) {
        let color = t_prop_change % 350 < 200 ? colors.white : colors.purple
        text(`[${color}]${prop_string(prop_change[1])!}[/]`, x, y, color === colors.white ? 50 : 60, { shadow: 4 })
    } else {
        text(prop_string(c.p)!, x, y, 50, { shadow: 4 })
    }

    //cx.fillRect(...card_box(c))

    if (is_selected) {


        circ_mask(x + 100, y - 300, 200, colors.black)

        y -= 60


        circ(x + 100, y - 200, 205, colors.black)
        circ(x + 100, y - 200, 200, colors.purple)

        text(`[${colors.green}]select[/] an action`, x - 55, y - 380, 42, { gap: 4, outline: 8, wave: 3})
        let cc = card_choices(c)

        if (cc === undefined || cc.length === 0) {
            c_text('no action available', x + 102, y - 200, 40, false)
        } else {
            let tt = cc.map(_ => prop_string(_))

            for (let i = 0; i < tt.length; i++) {
                cx.save()
                if (selected_prop === i) {
                    if (t_select > 0) {
                        let s = Math.max(1, 1 + 0.02 * t_select / 200)
                        cx.scale(s, s)
                    }
                }
                let [a, b, w, h] = c_text_xy(c, i, tt.length)
                rect(a, b, w, h, colors.black)
                rect(a + 4, b + 4, w - 8, h - 8, hovering_prop === i ? colors.green : colors.pink)
                c_text(tt[i]!, a + 180, b + 60, 40, hovering_prop === i)
                cx.restore()
            }
        }
    }
}

function c_text_xy(c: Card, i: number, l: number): XYWH {
    let [x, y] = c.pos
    x += 100
    y += 100

    y -= 60

    return [x + 90 - 180, y - 60 - (l <= 2 ? 250 : 290) + i * (l >= 3 ? 100 : 120), 380, 90]
}

function c_text(text: string, x: number, y: number, px: number, hi: boolean) {


    cx.textAlign = 'center'
    cx.font = `${px}px arial`

    cx.strokeStyle = hi ? colors.white : colors.black
    cx.lineWidth = 5
    cx.font = `${px}px arial`
    cx.strokeText(text, x, y)



    cx.fillStyle = hi ? colors.black : colors.white
    cx.fillText(text, x, y)


}

type LineOptions = {
    color?: Color
    width?: number
}

// @ts-ignore
function rect(x: number, y: number, w: number, h: number, color: Color) {
    cx.fillStyle = color
    cx.fillRect(x, y, w, h)
}



function circ_mask(x: number, y: number, radius: number, color?: Color) {
    cx.save()
    cx.beginPath()
    cx.ellipse(x, y, radius * 2, radius, 0, 0, PI2)
    cx.clip()

    cx.globalCompositeOperation = 'source-in'
    cx.fillStyle = color ?? colors.brown
    cx.fillRect(0, 0, w, h)
    cx.restore()
    cx.globalCompositeOperation = 'source-over'
}


function circ(x: number, y: number, radius: number, color?: Color) {
    cx.fillStyle = color ?? colors.black
    cx.beginPath()
    cx.arc(x, y, radius, 0, PI2)
    cx.fill()
}

// @ts-ignore
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

// @ts-ignore
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

    cat_walk(600, 0, 180, PI * 0.25)


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

    cx.strokeStyle=  opts.color === colors.white ? colors.black : colors.white
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

let pawn_randoms: number[] = []
for (let i = 0; i < 6; i++) {
    pawn_randoms.push(Math.random())
}

function cat_walk(x: number, y: number, size: number = 280, theta = 0) {
    cx.save()
    cx.translate(x, y)
    cx.rotate(theta)
    let at = t % 6000 / 6000 * 48
    for (let i = 0; i < 6; i++) {
        if (at < i * 2) {
            continue
        }
        paw(0 - 160 - pawn_randoms[i] * 80, 200 - (i - 2) * 180 + pawn_randoms[i] * 80, size)

        if (at - 1 < i * 2) {
            continue
        }
        paw(0 + pawn_randoms[i] * 80, 200 - ((i - 2) - 0.5) * 180, size)
    }
    cx.restore()
}

function paw(x: number, y: number, size: number = 280, opts: PieceOptions = {}) {
    let scale = size / 512

    cx.save()
    cx.translate(x, y)
    cx.scale(scale, scale)
    if (opts.theta) {
        let off_s = size / 1.6
        cx.translate(off_s, off_s)
        cx.rotate(opts.theta)
        cx.translate(-off_s, -off_s)
    }
    cx.fillStyle = opts.color ?? colors.black
    cx.fill(paths.paw)

    cx.beginPath()
    cx.ellipse(158, 250, 34, 26, PI * 0.3, 0, PI2)
    cx.fill()
    cx.beginPath()
    cx.ellipse(216, 190, 38, 29, PI * 0.43, 0, PI2)
    cx.fill()
    cx.beginPath()
    cx.ellipse(296, 190, 38, 29, -PI * 0.43, 0, PI2)
    cx.fill()
    cx.beginPath()
    cx.ellipse(358, 240, 34, 26, -PI * 0.3, 0, PI2)
    cx.fill()


    cx.fill()


    cx.strokeStyle = 'white'
    cx.lineWidth = 9
    cx.stroke(paths.paw)

    cx.beginPath()
    cx.ellipse(158, 250, 34, 26, PI * 0.3, 0, PI2)
    cx.stroke()
    cx.beginPath()
    cx.ellipse(216, 190, 38, 29, PI * 0.43, 0, PI2)
    cx.stroke()
    cx.beginPath()
    cx.ellipse(296, 190, 38, 29, -PI * 0.43, 0, PI2)
    cx.stroke()
    cx.beginPath()
    cx.ellipse(358, 240, 34, 26, -PI * 0.3, 0, PI2)
    cx.stroke()


    cx.restore()
}

let paths = {
    paw: new Path2D(`M 324.5,282.26
c -11.49-19.8-36.22-33.5-64.9-33.5
s -53.41,13.7-64.9,33.5
c -20.53,9.58-33.5,23.62-33.5,39.28,0,28.87,44.05,52.27,98.4,52.27
s 98.4-23.4,98.4-52.27
c 0-15.66-12.97-29.7-33.5-39.28
Z`),
    cursor: new Path2D(`m 150.036,266.494
c -0.264,0 -0.517,-0.006 -0.792,-0.018 -6.102,-0.337 -11.332,-4.474 -13.046,-10.347
L 110.131,167.102 14.928,148.235
C 8.914,147.041 4.314,142.176 3.452,136.112 2.594,130.05 5.653,124.096 11.102,121.28
L 242.143,1.617
c 5.357,-2.792 11.914,-1.907 16.375,2.183 4.474,4.101 5.885,10.55 3.562,16.146
l -98.743,237.655
c -2.24,5.417 -7.501,8.893 -13.301,8.893
z`),
    pawn: new Path2D(`M 25,46.448
H 11.606
c -0.658745,-1.599443 -0.99518,-3.313221 -0.99,-5.043 0,-2.975 0.863,-5.644 2.598,-8.018 1.736,-2.365 3.971,-4.054 6.697,-5.067 -1.158016,-0.517874 -2.148758,-1.348283 -2.861,-2.398 -0.737,-1.071 -1.1,-2.283 -1.1,-3.634 0,-1.69 0.575,-3.156 1.735,-4.392 1.151,-1.244 2.574,-1.961 4.267,-2.15 -1.346,-0.981 -2.015,-2.283 -2.015,-3.89 0,-1.351 0.491,-2.513 1.482,-3.477 0.982,-0.964 2.176,-1.442 3.581,-1.442 1.389,0 0,39.511 0,39.511
z`),
    queen: new Path2D(`m 24.95,10.752
c -0.94,0 -1.745,-0.33 -2.397,-0.99 -0.652,-0.66 -0.974,-1.465 -0.974,-2.405 0,-0.931 0.322,-1.727 0.974,-2.387 0.652,-0.66 1.456,-0.99 2.396,-0.99 4.457047,0 4.4506,6.772 0,6.772
z

M 25,46.448
c -3.75,0 -7.053,-0.254 -9.898,-0.745 -2.844,-0.5 -4.64,-1.118 -5.384,-1.863
L 11.284,37.888 10.59,33.993 8.405,30.2 6.297,14.774 7.507,14.3
l 6.8,11.455 0.152,-13.64 1.685,-0.296 5.182,13.716 2.776,-14.757
h 1.72
c 0,0 2.861,35.67 -0.822,35.67
z

M 14.535,11.989
c -0.948,0 -1.752,-0.322 -2.413,-0.974 -0.66,-0.652 -0.99,-1.456 -0.99,-2.396 0,-0.923 0.33,-1.719 0.99,-2.38 0.66,-0.661 1.465,-0.99 2.413,-0.99 0.923,0 1.719,0.33 2.38,0.99 0.661,0.66 0.99,1.457 0.99,2.38 0,0.94 -0.33,1.744 -0.99,2.396 -0.626755,0.636476 -1.486852,0.988465 -2.38,0.974
z

M 5.4,14.723
c -0.94,0 -1.736,-0.33 -2.388,-0.982
C 2.36,13.089 2.03,12.293 2.03,11.345 2.03,10.422 2.36,9.626 3.012,8.957 3.664,8.28 4.46,7.95 5.4,7.95
c 0.948,0 1.744,0.33 2.413,1.007 0.66,0.67 0.99,1.465 0.99,2.388 0,0.948 -0.33,1.744 -0.99,2.396 -0.6371462,0.642122 -1.508534,0.996744 -2.413,0.982
z`),
    rook: new Path2D(`M 28.408,9.22 28.360227,46.509958 8.071,46.448
V 40.52
h 3.793
v -5.08
l 4.242,-4.216
V 19.363
L 10.602,15.121
V 5.825
h 6.774
V 9.22
h 4.242
V 5.825
h 6.79
z`),
    knight: new Path2D(`m 26.178,9.395
c 3.717522,17.931492 -1.084802,22.136622 -1.084802,36.749211
L 15.468,46.454
c -0.152921,0.0049 -0.22,-0.407 -0.212,-1.21 0.009,-0.814 0.06,-1.466 0.16,-1.965 0.06,-0.398 0.221,-0.957 0.467,-1.685 0.254,-0.728 0.66,-1.609 1.244,-2.65 0.263,-0.534 0.89,-1.304 1.88,-2.32 0.999,-1.016 2.133,-2.201 3.429,-3.539 0.745,-0.762 1.32,-1.719 1.744,-2.879 0.423,-1.151 0.601,-2.201 0.533,-3.15 -0.608025,0.498896 -1.283334,0.909602 -2.006,1.22 -3.505,1.253 -6.045,3.073 -7.612,5.452 -0.118,0.153 -0.49,0.822 -1.117,2.015 -0.33,0.627 -0.618,1.059 -0.847,1.287 -0.313,0.314 -0.77,0.491 -1.363,0.525 -0.923,0.043 -1.643,-0.398 -2.16,-1.346
C 8.915,36.412 8.296,36.497 7.746,36.463 6.823,36.116 6.154,35.743 5.74,35.346 4.893,34.499 4.351,33.661 4.089,32.814 3.8293557,31.928859 3.7009886,31.01041 3.708,30.088
c 0,-1.389 0.855,-3.226 2.582,-5.512 2.015,-2.625 3.09,-4.631 3.217,-6.003 0,-0.593 0.06,-1.261 0.178,-2.007 0.107744,-0.531947 0.317618,-1.037953 0.618,-1.49 0.22,-0.33 0.364,-0.558 0.432,-0.677 0.076,-0.127 0.212,-0.313 0.415,-0.559 0.144,-0.203 0.27,-0.355 0.372,-0.457 0.093,-0.11 0.22,-0.254 0.373,-0.44 0.178,-0.212 0.406,-0.457 0.694,-0.745 -0.876289,-2.3839704 -1.23987,-4.9259689 -1.067,-7.46 3.285,1.169 6.054,3.015 8.28,5.53 0.551,-1.872 1.626,-3.387 3.226,-4.539 1.321,0.923 2.371,2.15 3.15,3.666
z`),
    bishop: new Path2D(`m 21.939789,10.038494
c 0,-0.9319996 0.322,-1.7199996 0.974,-2.3879996 0.652,-0.66 1.456,-0.99 2.396,-0.99 0.923,0 1.719,0.33 2.38,0.99 0.66,0.669 0.99,1.456 0.99,2.3879996 0,1.354 -0.61,2.353 -1.83,2.997 0.893481,1.058851 1.867735,2.046813 2.914,2.955 1.00122,0.853917 2.031844,1.672746 3.09,2.455 1.236,0.94 2.083,2.015 2.523,3.209 0.449,1.202 0.694,2.294 0.72,3.285 0,0.567 -0.051,1.202 -0.17,1.913 -0.119,0.711 -0.38,1.448 -0.796,2.21 -0.327332,0.590922 -0.750791,1.123203 -1.253,1.575 -0.5,0.457 -1.388,1.05 -2.667,1.795
l 2.583,6.4
c -0.729,0.263 -1.55,0.517 -2.456,0.754 -0.914,0.246 -1.786,0.415 -2.633,0.508 0.381,0.517 0.77,0.906 1.168,1.169 0.398,0.262 0.695,0.448 0.898,0.55 0.347,0.195 1.016,0.296 2.007,0.296 0.896656,-0.134633 1.794001,-0.264635 2.692,-0.39 0.908227,-0.119978 1.814357,-0.255331 2.718,-0.406 0.44,0.051 0.889,0.068 1.346,0.051 0.468462,-0.01644 0.937467,-0.0078 1.405,0.026 1.063053,0.100956 2.101902,0.378073 3.074,0.82 0.296,0.145 0.567,0.289 0.804,0.416 0.246,0.135 0.508,0.364 0.804,0.694
l -2.43,3.945
c -0.296,-0.296 -0.71,-0.524 -1.253,-0.677 -0.533,-0.16 -0.965,-0.237 -1.295,-0.237 -0.22,0 -0.44,-0.017 -0.66,-0.05 -0.250179,-0.03407 -0.503821,-0.03407 -0.754,0
l -6.95,0.964
c -0.992,0.153 -1.914,0.085 -2.761,-0.194 -0.855,-0.28 -1.558,-0.652 -2.1,-1.118 -3.100162,-9.58848 -5.478,-34.544 -5.478,-35.915
z`),
    king: new Path2D(`m 25.821,12.022
h -1.76
V 8.772
H 21.994
C 21.436,8.772 21.156,8.5 21.156,7.95
V 7.925
c 0,-0.542 0.28,-0.813 0.838,-0.813
H 24.06
V 5.004
c 0,-0.585 0.297,-0.872 0.89,-0.872 0.575,0 0.871,0.287 0.871,0.872
v 2.108
h 2.134
c 0.542,0 0.813,0.27 0.813,0.813
V 7.95
c 0,0.55 -0.271,0.821 -0.813,0.821
l -2.117,0.026
z

m -4.183,1.457
c 0.914,-0.906 2.023,-1.372 3.31,-1.389 1.287,0 2.388,0.466 3.302,1.38 0.906,0.915 1.363,2.015 1.363,3.285 0,0.263 -0.034,0.61 -0.101,1.042 0.228,-0.144 0.457,-0.271 0.669,-0.373 0.762,-0.33 1.76,-0.72 3.005,-1.16 1.423,-0.482 2.701,-0.753 3.844,-0.821 2.921,-0.136 5.241,0.753 6.943,2.65 1.668,1.888 2.447,3.785 2.328,5.681 -0.127,1.973 -0.703,3.65 -1.71,5.038 -0.33,0.449 -0.703,0.863 -1.118,1.253 -0.539774,0.506071 -1.093315,0.997256 -1.66,1.473 -0.541,0.466 -1.007,0.796 -1.388,0.982 -0.38,0.186 -0.6,0.347 -0.669,0.457 -0.01253,0.02813 -0.0294,0.05411 -0.05,0.077 -0.017,0.017 -0.026,0.034 -0.026,0.05
l -0.796,4.666 1.643,6.121
c -0.83,0.745 -2.684,1.355 -5.554,1.837 -2.879,0.483 -6.206,0.72 -9.974,0.72 -3.835,0 -4.284,-32.055 -3.361,-32.969
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

const role_to_path = {
    [bishop]: paths.bishop,
    [queen]: paths.queen,
    [rook]: paths.rook,
    [knight]: paths.knight,
    [king]: paths.king,
    [pawn]: paths.pawn,
}


const role_to_color = {
    [bishop]: colors.blue,
    [queen]: colors.yellow,
    [rook]: colors.brown,
    [knight]: colors.orange,
    [king]: colors.red,
    [pawn]: colors.lightgray,
}




type TextOptions = {
    wave?: number
    bold?: boolean
    gap?: number
    outline?: number
    shadow?: number
}

function text(text: string, x: number, y: number, px: number, opts: TextOptions = {}) {

    cx.textAlign = 'left'
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
            cx.strokeStyle = color === colors.black ? colors.white : colors.black
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

