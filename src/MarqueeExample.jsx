// MarqueeExample.js
import React from 'react';
import Marquee from 'react-fast-marquee';

function MarqueeExample() {
  return (
    <Marquee speed={200}>
      <h2 className="mx-10">🚀 React is Awesome!</h2>
      <h2 className="mx-10">🎯 Smooth Scrolling</h2>
      <h2 className="mx-10">🔥 Fast and Cool</h2>
    </Marquee>
  );
}
export default MarqueeExample;
