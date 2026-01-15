import { motion } from 'motion/react';
import logoImage from 'figma:asset/919d02f8edd5dc8644e4744c61cecfdf33c2d692.png';

export function RotatingLogo() {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={{ rotateY: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <img 
          src={logoImage} 
          alt="Dr. Spill Logo" 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
}