import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Text as SvgText, Line } from 'react-native-svg';

function DiscFlightGraph({ fade, turn }) {
  const [pathData, setPathData] = useState('');
  const { width } = Dimensions.get('window');
  const graphHeight = 400; // Adjust the height to 400

  useEffect(() => {
    const data = generateFlightPath(fade, turn);
    const pathString = dataToPath(data, width, graphHeight);
    setPathData(pathString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fade, turn]);

  return (
    <View style={{
      height: graphHeight, width: '100%', marginBottom: 100,
    }}
    >
      <Svg height={graphHeight} width={width} viewBox={`-10 -10 ${width + 20} ${graphHeight + 20}`} style={{ marginTop: 30 }}>
        <Path
          d={pathData}
          fill="none"
          stroke="rgb(134, 65, 244)"
          strokeWidth="2"
        />
        {/* Vertical dotted line from the beginning of the first line up */}
        <Line
          x1={(7) * (width / 14)}
          y1={graphHeight}
          x2={(7) * (width / 14)}
          y2="0"
          stroke="black"
          strokeWidth="1"
          strokeDasharray="3 10"
        />
        {/* X-axis labels */}
        {[-7, -5, -3, -1, 1, 3, 5, 7].map((i) => (
          <SvgText
            key={i}
            x={(i + 7) * (width / 14)}
            y={graphHeight + 20}
            fontSize="10"
            fill="black"
            textAnchor="middle"
          >
            {i}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const generateFlightPath = (fade, turn) => {
  const data = [{ x: 0, y: 0 }]; // Start with the initial point (0,0)
  const transitionY = 70; // Transition point at y = 70
  const maxY = 100; // Fixed range for y values

  // First curve control points
  const cp1 = { x: -turn, y: transitionY / 2 };
  const end1 = { x: -turn, y: transitionY };

  // Generate points for the second curve using a sine function
  const numPoints = 200; // Number of points
  const points = [];
  for (let i = 1; i <= numPoints; i += 1) {
    const t = i / numPoints;
    const x = -turn - t * fade;
    const y = transitionY + t * (maxY - transitionY) + Math.sin(t * Math.PI) * 5; // Reduced amplitude for smoother curve
    points.push({ x, y });
  }

  data.push(cp1, end1, ...points);

  return data;
};

const dataToPath = (data, width, height) => {
  const [start, cp1, end1, ...points] = data;
  const scaleX = width / 14;
  const scaleY = height / 100;

  let path = `M${(start.x + 7) * scaleX},${height - start.y * scaleY}
                C${(cp1.x + 7) * scaleX},${height - cp1.y * scaleY}
                 ${(end1.x + 7) * scaleX},${height - end1.y * scaleY}
                 ${(end1.x + 7) * scaleX},${height - end1.y * scaleY}`;

  points.forEach((point) => {
    path += ` L${(point.x + 7) * scaleX},${height - point.y * scaleY}`;
  });

  return path;
};

export default DiscFlightGraph;
