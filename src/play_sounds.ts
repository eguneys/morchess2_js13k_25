import { generate, saw, sin, sqr, } from "./infernal_sfx";

export type Sounds = {
    tactic: AudioBuffer
    click: AudioBuffer
    ring: AudioBuffer
    no_tactics: AudioBuffer
}

// roadroller top level await
export async function make_sounds(): Promise<Sounds> {


    let no_tactics = await generate(5, (i: number) => {
        return generateFMFailedSound(i)
    });

    function generateFMFailedSound(i: number, sampleRate = 44100) {
        const t = i / sampleRate;

        // Carrier frequency that descends
        let carrierBase = 1800 - t * 200; // Descending from 300Hz to 100Hz


        // Modulator for the "wah" effect
        const modulatorFreq = 3.5 - t * 0.8
        const modulatorDepth = 30 // How much the frequency wobbles

        const modulator = Math.sin(2 * Math.PI * modulatorFreq * t) * modulatorDepth;

        // Amplitude envelope
        const attack = Math.min(t / 0.8, 1) * Math.exp(-t * 2) * (0.7 + 0.3 * Math.sin(2 * Math.PI * 8 * t))
        const decay = Math.max(0, 1- t/ 20)
        const amplitude = attack * decay * 0.8

        return amplitude * Math.sin(2 * Math.PI * (carrierBase + modulator) * t);
    }

    let tactic = await generate(15, (i: number) => {
        return saw(i / 44100 * 2 * Math.PI * 420 * sqr(i / 44100 * 2 * Math.PI * 240 * i / 100) * 0.1) * 0.1;
    });

    let ring = await generate(.20, (i: number) => {
        return sin(i / 44100 * 2 * Math.PI  * 133 * i % 10000 < 5000 ? 2 : saw((i % 600 < 100 ? 1 : 2.22) * i / 44100 * 2 * Math.PI * 15))
    });

    let click = await generate(.20, (i: number) => {
        return (i *= -999) && 1.6 * sin(i / (100 + sin(i / 220 + sin(i / 440 + sin(i / 222))) - i / 400))
    });

    return {
        tactic,
        click,
        ring,
        no_tactics
    }
}

export { play } from './infernal_sfx'
