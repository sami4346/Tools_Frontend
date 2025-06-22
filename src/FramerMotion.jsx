import React from 'react';
import { motion } from 'framer-motion';

const FramerMotion = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      {/* motion.div animates this section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}       // Start hidden and 50px above
        animate={{ opacity: 1, y: 0 }}         // Fade in and slide down to normal position
        transition={{ duration: 1, delay: 0.2 }} // Animation lasts 1s with a slight delay
        style={{
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1>This fades and slides in using Framer Motion</h1>
        <p>Easy animations in React!</p>
      </motion.div>
    </div>
  );
};

export default FramerMotion;
