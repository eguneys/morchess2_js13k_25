
let id = 1
const p_knight_home = id++
const p_knight_flank = id++
const p_knight_natural = id++
const p_knight_center = id++
const p_knight_defend_king = id++
const p_knight_eye_king = id++
const p_knight_bother = id++
const p_knight_invade = id++
const p_knight_outpost = id++

const p_bishop_home = id++
const p_bishop_passive = id++
const p_bishop_active = id++
const p_bishop_pin = id++
const p_bishop_fianchetto = id++
const p_bishop_defend_king = id++
const p_bishop_eye_king = id++
const p_bishop_infiltrate = id++

const p_queen_home = id++
const p_queen_passive = id++
const p_queen_active = id++
const p_queen_centralized = id++
const p_queen_bishop_battery = id++
const p_queen_rook_battery = id++
const p_queen_infiltrate = id++
const p_queen_eye_king = id++

const p_rooks_home = id++
const p_rooks_connected = id++
const p_rooks_on_open_file = id++
const p_rooks_lift = id++
const p_rooks_on_the_7th = id++
const p_rooks_doubled = id++

const p_king_home = id++
const p_king_castled = id++
const p_king_weakened = id++
const p_king_exposed = id++
const p_king_running = id++


const p_pawn_home = id++
const p_pawn_center = id++
const p_pawn_tension = id++
const p_pawn_space = id++
const p_pawn_extend = id++
const p_pawn_thorn = id++
const p_pawn_outpost = id++


const p_pawn_chain = id++
const p_pawn_doubled_pawn = id++
const p_pawn_isolated_pawn = id++
const p_pawn_backward_pawn = id++
const p_pawn_passed_pawn = id++
const p_pawn_connected_passed_pawn = id++
const p_pawn_advanced_passed_pawn = id++


const p_phases_opening = id++
const p_phases_middle_game = id++
const p_phases_endgame = id++


const p_king_e_shelter = id++
const p_king_e_walk = id++
const p_king_e_cut_off = id++
const p_king_e_center = id++
const p_king_e_support_pawn = id++

const t_trap_piece = id++
const t_knight_fork = id++
const t_double_attack = id++
const t_skewer = id++
const t_discoved_check = id++
const t_backrank_mate = id++
const t_queen_checkmate = id++
const t_smothered_mate = id++
const t_arabian_mate = id++


const t_zugzwang = id++
const t_opposition = id++
const t_pawn_grab = id++
const t_stalemate = id++
const t_lader_mate = id++
const t_promotion = id++

export const PP = {
    p_knight_home,
    p_knight_flank,
    p_knight_natural,
    p_knight_center,
    p_knight_defend_king,
    p_knight_eye_king,
    p_knight_bother,
    p_knight_invade,
    p_knight_outpost,

    p_bishop_home,
    p_bishop_passive,
    p_bishop_active,
    p_bishop_pin,
    p_bishop_fianchetto,
    p_bishop_defend_king,
    p_bishop_eye_king,
    p_bishop_infiltrate,

    p_queen_home,
    p_queen_passive,
    p_queen_active,
    p_queen_centralized,
    p_queen_bishop_battery,
    p_queen_rook_battery,
    p_queen_infiltrate,
    p_queen_eye_king,

    p_rooks_home,
    p_rooks_connected,
    p_rooks_on_open_file,
    p_rooks_lift,
    p_rooks_on_the_7th,
    p_rooks_doubled,

    p_king_home,
    p_king_castled,
    p_king_weakened,
    p_king_exposed,
    p_king_running,


    p_pawn_home,
    p_pawn_center,
    p_pawn_tension,
    p_pawn_space,
    p_pawn_extend,
    p_pawn_thorn,
    p_pawn_outpost,

    p_pawn_chain,
    p_pawn_doubled_pawn,
    p_pawn_isolated_pawn,
    p_pawn_backward_pawn,
    p_pawn_passed_pawn,
    p_pawn_connected_passed_pawn,
    p_pawn_advanced_passed_pawn,


    p_phases_opening,
    p_phases_middle_game,
    p_phases_endgame,

    p_king_e_shelter,
    p_king_e_walk,
    p_king_e_cut_off,
    p_king_e_center,
    p_king_e_support_pawn,

    t_trap_piece,
    t_knight_fork,
    t_double_attack,
    t_skewer,
    t_discoved_check,
    t_backrank_mate,
    t_queen_checkmate,
    t_smothered_mate,
    t_arabian_mate,

    t_zugzwang,
    t_opposition,
    t_pawn_grab,
    t_stalemate,
    t_lader_mate,
    t_promotion,
}

export type Property = number

// property, pre conditions, adds, removes
export type Transform = [Property, Property[], Property[], Property[]]
// property transition
export type SResource = [Property, Property[]]


const rr_knight: SResource[] = [
    [p_knight_home, [p_knight_flank, p_knight_natural]],
    [p_knight_flank, [p_knight_center,p_knight_defend_king,p_knight_eye_king,p_knight_bother]],
    [p_knight_natural, [p_knight_center, p_knight_defend_king, p_knight_bother]],
    [p_knight_center, []],
    [p_knight_defend_king, [p_knight_center, p_knight_flank]],
    [p_knight_eye_king, [p_knight_center, p_knight_flank]],
    [p_knight_bother, [p_knight_center, p_knight_flank,p_knight_defend_king]],
    [p_knight_invade, [p_knight_center, p_knight_flank]],
    [p_knight_outpost, [p_knight_center, p_knight_flank]],
]

const rr_bishop: SResource[] = [
    [p_bishop_home, [p_bishop_passive, p_bishop_pin, p_bishop_fianchetto]],
    [p_bishop_passive, [p_bishop_active,p_bishop_defend_king]],
    [p_bishop_active, [p_bishop_passive, p_bishop_pin, p_bishop_infiltrate,p_bishop_eye_king]],
    [p_bishop_pin, [p_bishop_active,p_bishop_eye_king]],
    [p_bishop_defend_king, [p_bishop_active, p_bishop_passive]],
    [p_bishop_eye_king, [p_bishop_active, p_bishop_passive]],
    [p_bishop_fianchetto, [p_bishop_eye_king]],
    [p_bishop_infiltrate, [p_bishop_active, p_bishop_passive]],
]


const rr_queen: SResource[] = [
    [p_queen_home, [p_queen_passive, p_queen_active]],
    [p_queen_passive, [p_queen_centralized,p_queen_bishop_battery,p_queen_rook_battery]],
    [p_queen_active, [p_queen_centralized, p_queen_infiltrate, p_queen_eye_king]],
    [p_queen_centralized, []],
    [p_queen_infiltrate, []],
    [p_queen_eye_king, []],
    [p_queen_bishop_battery, []],
    [p_queen_rook_battery, []],
]

const rr_rooks: SResource[] = [
    [p_rooks_home, [p_rooks_connected, p_rooks_on_open_file]],
    [p_rooks_connected, [p_rooks_doubled,p_rooks_on_open_file]],
    [p_rooks_on_open_file, [p_rooks_lift, p_rooks_on_the_7th]],
    [p_rooks_lift, [p_rooks_doubled, p_rooks_on_the_7th]],
]

const rr_pawns: SResource[] = [
    [p_pawn_home, [p_pawn_center, p_pawn_space]],
    [p_pawn_center, [p_pawn_tension, p_pawn_extend]],
    [p_pawn_space, [p_pawn_tension, p_pawn_extend]],
    [p_pawn_tension, [p_pawn_extend]],
    [p_pawn_extend, [p_pawn_thorn, p_pawn_outpost]],
]


const rr_king: SResource[] = [
    [p_king_e_shelter, [p_king_e_walk]],
    [p_king_e_walk, [p_king_e_center]],
    [p_king_e_center, [p_king_e_support_pawn]],
]



// property +-positive
type Prequisite = [Property, Property[]]

const prequisites: Prequisite[] = [
    [p_king_castled, [-p_knight_home, -p_bishop_home]],
    [p_queen_bishop_battery, [p_bishop_passive]],
    [p_queen_rook_battery, [-p_rooks_home]],
    [p_king_e_walk, [-p_king_e_cut_off]],
    [p_knight_outpost, [p_pawn_outpost]]
]

const opp_prequisites: Prequisite[] = [
    [p_king_e_cut_off, [p_rooks_on_the_7th]],
]

const pawn_weaknesses: Property[] = [
    p_pawn_doubled_pawn,
    p_pawn_isolated_pawn,
    p_pawn_backward_pawn
]

console.log(rr_bishop, rr_knight, rr_queen, rr_rooks, rr_pawns, prequisites, rr_king, opp_prequisites, pawn_weaknesses)


export type Role = 1 | 2 | 3 | 4 | 5 | 6
export const knight: Role = 1
export const bishop: Role = 2
export const rook: Role = 3
export const king: Role = 4
export const queen: Role = 5
export const pawn: Role = 6

// tactic, prequisites, opponent prequisites, remove, opponent remove
type Tactic = [Property[], Property[], Property[], Property[], number]


const tt_trap_piece: Tactic[] = [
    [[p_bishop_active], [], [], [bishop], 1],
    [[p_bishop_pin], [], [], [bishop], 1],
    [[p_knight_eye_king], [], [], [knight], 1],
    [[p_knight_bother], [], [], [knight], 1],
    [[p_knight_invade], [], [], [knight], 1],
    [[p_queen_eye_king], [], [], [queen], 1],
    [[p_queen_infiltrate], [], [], [queen], 1],
]

const tt_knight_fork: Tactic[] = [
    [[p_knight_bother], [p_bishop_defend_king], [], [bishop], 1],
    [[p_knight_bother], [p_bishop_eye_king], [], [bishop], 1],
    [[p_knight_bother], [p_bishop_passive], [], [bishop], 1],

    [[p_knight_flank], [p_bishop_defend_king], [], [bishop], 1],
    [[p_knight_flank], [p_bishop_eye_king], [], [bishop], 1],
    [[p_knight_flank], [p_bishop_passive], [], [bishop], 1],

    [[p_knight_invade], [p_bishop_defend_king], [], [bishop], 1],
    [[p_knight_invade], [p_bishop_eye_king], [], [bishop], 1],
    [[p_knight_invade], [p_bishop_passive], [], [bishop], 1],

    [[p_knight_outpost], [p_bishop_defend_king], [], [bishop], 1],
    [[p_knight_outpost], [p_bishop_eye_king], [], [bishop], 1],
    [[p_knight_outpost], [p_bishop_passive], [], [bishop], 1],

    [[p_knight_bother], [p_queen_eye_king], [], [queen], 1],
    [[p_knight_bother], [p_queen_passive], [], [queen], 1],

    [[p_knight_flank], [p_queen_eye_king], [], [queen], 1],
    [[p_knight_flank], [p_queen_passive], [], [queen], 1],

    [[p_knight_invade], [p_queen_eye_king], [], [queen], 1],
    [[p_knight_invade], [p_queen_passive], [], [queen], 1],

    [[p_knight_outpost], [p_queen_eye_king], [], [queen], 1],
    [[p_knight_outpost], [p_queen_passive], [], [queen], 1],


    [[p_knight_bother], [p_rooks_connected], [], [rook], 1],
    [[p_knight_bother], [p_rooks_doubled], [], [rook], 1],
    [[p_knight_bother], [p_rooks_lift], [], [rook], 1],
    [[p_knight_bother], [p_rooks_home], [], [rook], 1],
    [[p_knight_bother], [p_rooks_on_open_file], [], [rook], 1],
    [[p_knight_bother], [p_rooks_on_the_7th], [], [rook], 1],

    [[p_knight_flank], [p_rooks_connected], [], [rook], 1],
    [[p_knight_flank], [p_rooks_doubled], [], [rook], 1],
    [[p_knight_flank], [p_rooks_lift], [], [rook], 1],
    [[p_knight_flank], [p_rooks_home], [], [rook], 1],
    [[p_knight_flank], [p_rooks_on_open_file], [], [rook], 1],
    [[p_knight_flank], [p_rooks_on_the_7th], [], [rook], 1],

    [[p_knight_invade], [p_rooks_connected], [], [rook], 1],
    [[p_knight_invade], [p_rooks_doubled], [], [rook], 1],
    [[p_knight_invade], [p_rooks_lift], [], [rook], 1],
    [[p_knight_invade], [p_rooks_home], [], [rook], 1],
    [[p_knight_invade], [p_rooks_on_open_file], [], [rook], 1],
    [[p_knight_invade], [p_rooks_on_the_7th], [], [rook], 1],

    [[p_knight_outpost], [p_rooks_connected], [], [rook], 1],
    [[p_knight_outpost], [p_rooks_doubled], [], [rook], 1],
    [[p_knight_outpost], [p_rooks_lift], [], [rook], 1],
    [[p_knight_outpost], [p_rooks_home], [], [rook], 1],
    [[p_knight_outpost], [p_rooks_on_open_file], [], [rook], 1],
    [[p_knight_outpost], [p_rooks_on_the_7th], [], [rook], 1],
]


const tt_skewer: Tactic[] = [
    [[p_bishop_active], [], [bishop], [rook], 1],
    [[p_bishop_active], [], [bishop], [queen], 1],

    [[p_bishop_passive], [], [bishop], [rook], 1],
    [[p_bishop_passive], [], [bishop], [queen], 1],

    [[p_bishop_eye_king], [], [bishop], [rook], 1],
    [[p_bishop_eye_king], [], [bishop], [queen], 1],

    [[p_bishop_fianchetto], [], [bishop], [rook], 1],
    [[p_bishop_fianchetto], [], [bishop], [queen], 1],

    [[p_bishop_infiltrate], [], [bishop], [rook], 1],
    [[p_bishop_infiltrate], [], [bishop], [queen], 1],

    [[p_bishop_pin], [], [bishop], [rook], 1],
    [[p_bishop_pin], [], [bishop], [queen], 1],
]

const tt_discovered_check: Tactic[] = [
    [[p_bishop_eye_king, p_knight_eye_king], [], [], [], 1],
    [[p_bishop_eye_king, p_knight_invade], [], [], [], 1],
    [[p_bishop_eye_king, p_knight_outpost], [], [], [], 1],

    [[p_queen_eye_king, p_knight_eye_king], [], [], [], 1],
    [[p_queen_eye_king, p_knight_invade], [], [], [], 1],
    [[p_queen_eye_king, p_knight_outpost], [], [], [], 1],
]

const tt_queen_checkmate: Tactic[] = [
    [[p_queen_eye_king, p_knight_eye_king], [], [], [], 1],
    [[p_queen_eye_king, p_bishop_eye_king], [], [], [], 1],
    [[p_queen_eye_king, p_rooks_on_the_7th], [], [], [], 1],
    [[p_queen_eye_king, p_rooks_on_open_file], [], [], [], 1],
]

const tt_smothered_mate: Tactic[] = [
    [[p_queen_eye_king, p_knight_eye_king], [], [], [], 1],
]

const tt_arabian_mate: Tactic[] = [
    [[p_rooks_lift, p_knight_eye_king], [], [], [], 1],
    [[p_rooks_on_the_7th, p_knight_eye_king], [], [], [], 1],
]



console.log(tt_knight_fork, tt_trap_piece, tt_skewer, tt_discovered_check, tt_queen_checkmate, tt_smothered_mate, tt_arabian_mate)