import { generate, saw, sin, sqr, } from "./infernal_sfx";

export type Sounds = {
    tactic: AudioBuffer
    click: AudioBuffer
    ring: AudioBuffer
}

// roadroller top level await
export async function make_sounds(): Promise<Sounds> {

    let tactic = await generate(15, (i: number) => {
        return saw(i / 44100 * 2 * Math.PI * 420 * sqr(i / 44100 * 2 * Math.PI * 240 * i / 100) * 0.1) * 0.1;
    });

    let ring = await generate(.20, (i: number) => {
        return saw(i / 44100 * 2 * Math.PI * sin(i < 2000 ? 30 : 60) * 800)
    });

    let click = await generate(.20, (i: number) => {
        return (i *= -999) && 1.6 * sin(i / (100 + sin(i / 220 + sin(i / 440 + sin(i / 222))) - i / 400))
    });

    return {
        tactic,
        click,
        ring
    }
}

export { play } from './infernal_sfx'
