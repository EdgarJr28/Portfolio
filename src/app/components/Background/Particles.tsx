import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { ISourceOptions, MoveDirection, OutMode } from "@tsparticles/engine";
import { useCtx } from "@/app/context/context";

const ParticlesBackground = () => {
    const [init, setInit] = useState(false);
    const { color }: any = useCtx();
    const [bgColor, setBgColor] = useState<string>('');
    const [particlesColor, setParticlesColor] = useState<string>('#ffffff');

    useEffect(() => {
        if (color === 'white') {
            setBgColor('#333333');
            setParticlesColor('#ffffff');
        } else {
            setBgColor('#FFFFFF');
            setParticlesColor('#686868');
        }

        const initParticles = async () => {
            await initParticlesEngine(loadSlim);
            setInit(true);
        };

        initParticles();
    }, [color]);

    const options: ISourceOptions = useMemo(
        () => ({
            autoPlay: true,
            fullScreen: {
                enable: false,
                zIndex: 99
            },
            preset: "edge",
            particles: {
                pauseOnBlur: true,
                number: {
                    value: 200,
                    density: {
                        enable: true,
                        value_area: 100,
                    },
                },
                color: {
                    value: particlesColor,
                },
                shape: {
                    type: "edge",
                    polygon: {
                        nb_sides: 5,
                    },
                    stroke: {
                        width: 0,
                        color: "#000000",
                    }
                },
                opacity: {
                    anim: {
                        enable: false,
                        opacity_min: 0,
                        speed: 1,
                    },
                    random: true,
                    value: 1,
                },
                links: {
                    enable: true, // `line_linked` es reemplazado por `links` en la nueva configuración
                    distance: 150,
                    opacity: 0.4,
                    width: 1,
                    color: particlesColor,
                },
                size: {
                    anim: {
                        enable: true,
                        size_min: 0.3,
                        speed: 4,
                    },
                    random: false,
                    value: 4,
                },
                move: {
                    enable: true,
                    direction: MoveDirection.none,
                    random: false,
                    speed: 2,
                    outModes: {
                        default: OutMode.bounce,
                    },
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200,
                    },
                },
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onHover: {
                        enable: true,
                        mode: "bubble",
                    },
                    onClick: {
                        enable: true,
                        mode: "repulse",
                    },
                },
                modes: {
                    bubble: {
                        distance: 250,
                        duration: 1,
                        size: 0,
                        opacity: 0.3,
                    },
                    repulse: {
                        distance: 200,
                        duration: 4,
                    },
                },
            },
            background: {
                color: {
                    value: bgColor,
                },
                hide_card: true,
            },
            fpsLimit: 120,
            retina_detect: true,
        }),
        [bgColor, particlesColor],
    );

    if (init) {
        return <Particles
            className="absolute rounded-full inset-0 w-full h-full"
            id="tsparticles"
            options={options}
        />
    }

    return null;
};

export default ParticlesBackground;
