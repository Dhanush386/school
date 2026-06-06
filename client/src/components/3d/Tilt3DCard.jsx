import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Tilt3DCard - wraps any children with a smooth 3D tilt effect on hover
 * Usage: <Tilt3DCard className="..."> ... </Tilt3DCard>
 */
export default function Tilt3DCard({ children, className = '', style = {}, intensity = 12 }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]), springConfig);
  const glareX = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]), springConfig);
  const scale = useSpring(isHovered ? 1.04 : 1, springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        perspective: 800,
        transformStyle: 'preserve-3d',
        position: 'relative',
        cursor: 'default',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Glare overlay */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            opacity: isHovered ? 0.12 : 0,
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.9) 0%, transparent 60%)`
            ),
            transition: 'opacity 0.3s ease',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
