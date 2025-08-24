import * as c from './choices'
import type { XY } from './util'


export type Card = {
    c: c.Color
    r: c.Role
    p: c.Property
    pos: XY
}

export type Cards = {
    cards: Card[]
}

function card(r: c.Role, p: c.Property, color: c.Color): Card {
    let pos: XY = [(r - 1) * 300, (1 - color) * 400]
    return { c: color, r, p, pos }
}


export function card_choices(card: Card, cc: Card[]) {
    return c.rr_by_role[card.r].find(_ => _[0] === card.p)?.[1].filter(_ => {
        let pp = c.prequisites.find(p => p[0] === _)
        if (pp) {
            for (let p of pp[1]) {

                if (p < 0) {
                    let exists = cc.find(c => c.p === -p)
                    if (exists) {
                        return false
                    }
                } else {
                    let exists = cc.find(c => c.p === p)
                    if (!exists) {
                        return false
                    }
                }
            }

            return true
        } else {
            return true
        }
    })
}

export function prop_string(p: c.Property) {
    for (let key of Object.keys(c.PP)) {
        if (c.PP[key] === p) {
            return key.includes('eye_king') ? 'eye king' :
            key
            .replace(/p_/, '')
            .replace(/_/g, ' ')
            .replace(/pawn/, '')
            .replace(/queen/, '')
            .replace(/king/, '')
            .replace(/bishop/, '')
            .replace(/rooks/, '')
            .replace(/knight/, '')
        }
    }
}

export function cards(): Cards {

    return {
        cards: [
            card(c.bishop, c.p_bishop_home, c.black),
            card(c.knight, c.p_knight_home, c.black),
            card(c.king, c.p_king_home, c.black),
            card(c.rook, c.p_rooks_home, c.black),
            card(c.queen, c.p_queen_home, c.black),
            card(c.pawn, c.p_pawn_home, c.black),

            card(c.bishop, c.p_bishop_home, c.white),
            card(c.knight, c.p_knight_home, c.white),
            card(c.king, c.p_king_home, c.white),
            card(c.rook, c.p_rooks_home, c.white),
            card(c.queen, c.p_queen_home, c.white),
            card(c.pawn, c.p_pawn_home, c.white),
        ]
    }
}