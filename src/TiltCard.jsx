import React from 'react';
import Tilt from 'react-vanilla-tilt';

function TiltCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Tilt
        options={{ scale: 1.05, speed: 1000, max: 15 }}
        className="w-72 h-48 rounded-xl shadow-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xl font-semibold"
      >
        Tilt Me!
      </Tilt>
    </div>
  );
}

export default TiltCard;
