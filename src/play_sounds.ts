import { generate, saw, sin, sqr, } from "./infernal_sfx";

//const rnd = () => Math.random()

let tactic = await generate(.20, (i: number) => {
    return saw(i / 44100 * 2 * Math.PI * 420 * sqr(i/44100 * 2 * Math.PI * 240 * i / 100) * 0.1) * 0.1; 
});

let ring = await generate(.20, (i: number) => {
    return sqr(i / 100 * 2 * Math.PI * 420) * 0.1; 
});

let click = await generate(.20, (i: number) => {
    return (i*=-999)&&1.6 * sin(i / (20 + sin(i/900 + sin(i / 440 + sin(i / 222))) - i / 400))
});

export const sounds = {
    tactic,
    click,
    ring
}

export { play } from './infernal_sfx'
