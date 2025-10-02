// @ts-check

/**
 * @param {[number, number][]} linePoints
 * @param {HTMLCanvasElement} canvas
 * @param {SVGSVGElement} svg
 * @return {SVGPathElement | null} A curved path with canvas points converted to svg points relative to svg.width and svg.height (may be different than canvas.width and canvas.height)
 */
export default function linePointsToSVGPath(linePoints, canvas, svg) {
    // If linePoints is empty, return null
    if (!linePoints || linePoints.length === 0) {
        return null;
    }

    // Get dimensions for coordinate transformation
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const svgWidth = svg.width.baseVal.value;
    const svgHeight = svg.height.baseVal.value;
    
    // Convert canvas points to SVG coordinates
    const svgPoints = linePoints.map(([x, y]) => {
        // Normalize canvas coordinates (0-1 range)
        const normalizedX = x / canvasWidth;
        const normalizedY = y / canvasHeight;
        
        // Convert to SVG coordinates
        const svgX = normalizedX * svgWidth;
        const svgY = normalizedY * svgHeight;
        
        return [svgX, svgY];
    });

    // Create SVG path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    
    // Build path data using cubic Bezier curves for smooth interpolation
    let pathData = `M ${svgPoints[0][0]} ${svgPoints[0][1]}`;
    
    if (svgPoints.length === 1) {
        // Single point - create a tiny line to make it visible
        pathData += ` l 1 1`;
    } else if (svgPoints.length === 2) {
        // Two points - simple line
        pathData += ` L ${svgPoints[1][0]} ${svgPoints[1][1]}`;
    } else {
        // Three or more points - use cubic Bezier curves for smooth interpolation
        for (let i = 1; i < svgPoints.length - 1; i++) {
            const [x0, y0] = svgPoints[i - 1];
            const [x1, y1] = svgPoints[i];
            const [x2, y2] = svgPoints[i + 1];
            
            // Calculate control points for smooth curve
            const controlPoint1X = x0 + (x1 - x0) * 0.5;
            const controlPoint1Y = y0 + (y1 - y0) * 0.5;
            const controlPoint2X = x1 - (x2 - x0) * 0.25;
            const controlPoint2Y = y1 - (y2 - y0) * 0.25;
            
            pathData += ` C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${x1} ${y1}`;
        }
        
        // Add the last point
        const [lastX, lastY] = svgPoints[svgPoints.length - 1];
        pathData += ` L ${lastX} ${lastY}`;
    }

    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    
    return path;
}
