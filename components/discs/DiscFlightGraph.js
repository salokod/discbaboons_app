import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, {
  Path, Text as SvgText, Line, Polygon,
} from 'react-native-svg';
import { useTheme } from '@rneui/themed';

function DiscFlightGraph({ fade, turn }) {
  const { theme } = useTheme();

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
          stroke={theme.colors.font}
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
        {/* Left arrow and label */}
        <Polygon
          points={`${(0.5) * (width / 14)},${graphHeight - 10} ${(1.5) * (width / 14)},${graphHeight - 5} ${(1.5) * (width / 14)},${graphHeight - 15}`}
          fill={theme.colors.font}
        />
        <SvgText
          x={(1) * (width / 14)}
          y={graphHeight + 10} // Adjusted y coordinate
          fontSize="10"
          fill={theme.colors.font}
          textAnchor="middle"
            // eslint-disable-next-line react-native/no-raw-text
        >
          Overstable
        </SvgText>
        {/* Right arrow and label */}
        <Polygon
          points={`${(13.5) * (width / 14)},${graphHeight - 10} ${(12.5) * (width / 14)},${graphHeight - 5} ${(12.5) * (width / 14)},${graphHeight - 15}`}
          fill={theme.colors.font}
        />
        <SvgText
          x={(13) * (width / 14)}
          y={graphHeight + 10} // Adjusted y coordinate
          fontSize="10"
          fill={theme.colors.font}
          textAnchor="middle"
          // eslint-disable-next-line react-native/no-raw-text
        >
          Understable
        </SvgText>
      </Svg>
    </View>
  );
}

// const generateFlightPath = (fade, turn) => {
//   const data = [{ x: 0, y: 0 }]; // Start with the initial point (0,0)
//   const transitionY = 70; // Transition point at y = 70
//   const maxY = 100; // Fixed range for y values
//
//   // Combined curve control points
//   const cp1 = { x: turn, y: transitionY * 0.75 }; // Control point for the first part of the curve
//   const cp2 = { x: -turn * 0.9, y: transitionY * 0.9 }; // Control point for the transition
//   const end = { x: -turn - fade, y: maxY }; // End point for the curve
//
//   // Generate points for the combined curve using a Bezier function
//   const numPoints = 400; // Number of points for smoother curve
//   const points = [];
//   for (let i = 1; i <= numPoints; i += 1) {
//     const t = i / numPoints;
//     const x = (1 - t) * (1 - t) * (1 - t) * data[0].x + 3 * (1 - t) * (1 - t) * t * cp1.x + 3 * (1 - t) * t * t * cp2.x + t * t * t * end.x;
//     const y = (1 - t) * (1 - t) * (1 - t) * data[0].y + 3 * (1 - t) * (1 - t) * t * cp1.y + 3 * (1 - t) * t * t * cp2.y + t * t * t * end.y;
//     points.push({ x, y });
//   }
//
//   data.push(...points);
//
//   return data;
// };

const generateFlightPath = (fade, turn) => {
  const data = [{ x: 0, y: 0 }]; // Start with the initial point (0,0)
  const transitionY = 70; // Transition point at y = 70
  const maxY = 100; // Fixed range for y values

  // Combined curve control points
  const cp1 = { x: 0, y: transitionY * 0.3 }; // Control point for the first part of the curve (straight for 30%)
  const cp2 = { x: -turn * 1.5, y: transitionY * 0.9 }; // Control point for the transition
  const end = { x: -turn - fade, y: maxY }; // End point for the curve

  // Generate points for the combined curve using a Bezier function
  const numPoints = 400; // Number of points for smoother curve
  const points = [];
  for (let i = 1; i <= numPoints; i += 1) {
    const t = i / numPoints;
    const x = (1 - t) * (1 - t) * (1 - t) * data[0].x + 3 * (1 - t) * (1 - t) * t * cp1.x + 3 * (1 - t) * t * t * cp2.x + t * t * t * end.x;
    const y = (1 - t) * (1 - t) * (1 - t) * data[0].y + 3 * (1 - t) * (1 - t) * t * cp1.y + 3 * (1 - t) * t * t * cp2.y + t * t * t * end.y;
    points.push({ x, y });
  }

  data.push(...points);

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
