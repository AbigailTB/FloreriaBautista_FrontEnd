import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface AnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
}

export const FadeIn: React.FC<AnimationProps> = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<AnimationProps> = ({ children, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<AnimationProps> = ({ children, ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
);

export const GlassCard: React.FC<AnimationProps> = ({ children, ...props }) => (
  <motion.div
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/20 shadow-xl rounded-3xl overflow-hidden"
    {...props}
  >
    {children}
  </motion.div>
);

export const AnimatedButton: React.FC<AnimationProps & { onClick?: () => void; className?: string }> = ({ 
  children, 
  onClick, 
  className = "", 
  ...props 
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`relative overflow-hidden group ${className}`}
    {...props}
  >
    <span className="relative z-10 flex items-center justify-center gap-2 w-full h-full">
      {children}
    </span>
    <motion.div
      className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
    />
  </motion.button>
);
