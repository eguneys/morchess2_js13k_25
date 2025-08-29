import * as c from './choices'
import { arr_shuffle } from './random'
import type { XY } from './util'


export type Card = {
    c: c.Color
    r: c.Role
    p: c.Property
    pos: XY
    choices?: c.Property[]
}

export type Cards = {
    cards: Card[]
    turn: c.Color
}

function card(r: c.Role, p: c.Property, color: c.Color): Card {
    let pos: XY = [(r - 1) * 300, (1 - color) * 400]
    return { c: color, r, p, pos }
}

export function tactic_choices(cc: Cards) {
    let us = cc.cards.filter(_ => _.c === cc.turn)
    let them = cc.cards.filter(_ => _.c !== cc.turn)

    let [t, tt] = w_select(c.t_by_tactic_chances)

    if (t === -1) {
        return undefined
    }

    let tt2 = tt.filter(_ =>
        _[0].every(p => us.find(_ => _.p === p)) &&
        _[1].every(p => them.find(_ => _.p === p))
    ).map<[[c.Property[], c.Property[]], number]>(_ => [[_[2], _[3]], _[4]])

    tt2 = tt.map<[[c.Property[], c.Property[]], number]>(_ => [[_[2], _[3]], _[4]])

    if (tt2.length === 0) {
        return undefined
    }

    let [t_remove, t_op_remove] = w_select(
        tt2
    )

    let res: [c.Property, c.Property[], c.Property[]] = [t, t_remove, t_op_remove]
    return res
}

function w_select<T>(a: [T, number][]): T {
    // Calculate total weight
    const totalWeight = a.reduce((sum, [, weight]) => sum + weight, 0);
    
    // Generate random number between 0 and totalWeight
    const randomValue = Math.random() * totalWeight;
    
    // Find which item corresponds to the random value
    let cumulativeWeight = 0;
    for (const [item, weight] of a) {
        cumulativeWeight += weight;
        if (randomValue <= cumulativeWeight) {
            return item;
        }
    }
    
    // Fallback (shouldn't reach here due to floating point precision)
    return a[a.length - 1][0];
}

export function card_choices(card: Card, cc: Card[]) {
    let res = c.rr_by_role[card.r].find(_ => _[0] === card.p)?.[1]

    if (res?.length === 0) {
        return arr_shuffle(c.rr_by_role[card.r].map(_ => _[0])).slice(0, 3)
    }

    return res?.filter(_ => {
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

export function tactic_string(p: c.Property) {
    for (let key of Object.keys(c.PP)) {
        if (c.PP[key] === p) {
            let res = key.replace(/t_/, '')
            .replace(/_/g, ' ')

            return res.split(' ').map(_ => _[0].toUpperCase() + _.slice(1)).join(' ')
        }
    }
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
        turn: c.white,
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