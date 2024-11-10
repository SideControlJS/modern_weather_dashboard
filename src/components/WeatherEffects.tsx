import React from 'react';
import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

interface WeatherEffectsProps {
  condition: string;
}

export const WeatherEffects: React.FC<WeatherEffectsProps> = ({ condition }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const getParticlesConfig = (condition: string) => {
    const configs = {
      Rain: {
        particles: {
          color: { value: "#ffffff" },
          move: {
            direction: "bottom",
            enable: true,
            speed: 15,
            straight: true,
          },
          size: {
            value: 1.5,
          },
          number: {
            value: 200,
          },
        },
      },
      Snow: {
        particles: {
          color: { value: "#ffffff" },
          move: {
            direction: "bottom",
            enable: true,
            speed: 2,
            straight: false,
          },
          size: {
            value: 3,
          },
          number: {
            value: 100,
          },
          wobble: {
            enable: true,
            distance: 10,
            speed: 10,
          },
        },
      },
      Clear: {
        particles: {
          color: { value: "#FFD700" },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
          },
          size: {
            value: 2,
          },
          number: {
            value: 50,
          },
          opacity: {
            value: 0.6,
          },
        },
      },
    };

    return configs[condition as keyof typeof configs] || null;
  };

  const config = getParticlesConfig(condition);
  if (!config) return null;

  return (
    <Particles
      id="weather-particles"
      init={particlesInit}
      options={{
        background: {
          opacity: 0,
        },
        fpsLimit: 60,
        ...config,
      }}
      className="absolute inset-0 pointer-events-none"
    />
  );
};