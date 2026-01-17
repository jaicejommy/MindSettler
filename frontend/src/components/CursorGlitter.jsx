import React, { useEffect, useRef, useCallback } from 'react';
import './CursorGlitter.css';

/**
 * CursorGlitter - A subtle, premium cursor-based particle effect
 * 
 * Features:
 * - Canvas-based for performance
 * - Theme-aware colors (pink accent, purple, white)
 * - Intermittent particle spawning
 * - Auto-disabled on mobile/touch
 * - Respects prefers-reduced-motion
 */
const CursorGlitter = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationRef = useRef(null);
    const lastMoveRef = useRef(0);
    const moveCountRef = useRef(0);

    // Theme colors - Strong, dark, prominent colors for high visibility
    const COLORS = [
        'rgba(221, 23, 100, 0.75)',   // Strong Pink
        'rgba(63, 41, 101, 0.75)',    // Strong Purple
        'rgba(180, 20, 80, 0.85)',    // Darker Pink
        'rgba(45, 30, 75, 0.85)',     // Darker Purple
        'rgba(80, 20, 50, 0.8)',      // Deep Maroon/Purple mix
    ];

    // Check if we should disable the effect
    const shouldDisable = useCallback(() => {
        // Disable on small screens
        if (window.innerWidth < 768) {
            return true;
        }
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return true;
        }
        // Disable on devices that primarily use touch (no hover)
        if (window.matchMedia('(hover: none)').matches) {
            return true;
        }
        return false;
    }, []);

    // Create a particle
    const createParticle = useCallback((x, y) => {
        const size = Math.random() * 2 + 1.5; // Small: 1.5-3.5px
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        return {
            x: x + (Math.random() - 0.5) * 15,
            y: y + (Math.random() - 0.5) * 15,
            size,
            color,
            life: 1,
            decay: Math.random() * 0.015 + 0.01, // Slower decay for longer trail
            vx: (Math.random() - 0.5) * 1.5, // More spread
            vy: (Math.random() - 0.5) * 1.5 + 0.5, // Faster movement
        };
    }, []);

    // Animation loop
    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particlesRef.current = particlesRef.current.filter(particle => {
            particle.life -= particle.decay;
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.life <= 0) return false;

            // Draw particle with blur effect
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.shadowBlur = 4; // Tighter shadow for cleaner look
            ctx.shadowColor = particle.color;
            ctx.fill();
            ctx.restore();

            return true;
        });

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    // Handle mouse movement
    const handleMouseMove = useCallback((e) => {
        if (shouldDisable()) return;

        const now = Date.now();
        // Faster throttle: 15ms
        if (now - lastMoveRef.current < 15) return;
        lastMoveRef.current = now;

        // Limit max particles
        if (particlesRef.current.length > 200) {
            particlesRef.current.shift(); // Remove oldest if too many
        }

        // Always spawn (no skipping)
        // Spawn 2-4 particles per event
        const count = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < count; i++) {
            particlesRef.current.push(createParticle(e.clientX, e.clientY));
        }
    }, [shouldDisable, createParticle]);

    // Resize handler
    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, []);

    useEffect(() => {
        // Skip setup if should be disabled
        if (shouldDisable()) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set initial canvas size
        handleResize();

        // Start animation
        animate();

        // Add event listeners
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            particlesRef.current = [];
        };
    }, [shouldDisable, handleMouseMove, handleResize, animate]);

    // Don't render on mobile/touch
    if (shouldDisable()) return null;

    return (
        <canvas
            ref={canvasRef}
            className="cursor-glitter-canvas"
            aria-hidden="true"
        />
    );
};

export default CursorGlitter;
