const alphOrder = "EioIOöUeaAuäxpbfvmwtdTDszSZcjnlkghyrqQ"
export function alphabetize(str1, str2, desc = false) {
    const maxLength = Math.max(str1.length, str2.length);
    
    for (let i = 0; i < maxLength; i++) {
        const char1 = str1[i];
        const char2 = str2[i];
        
        // If one string is shorter than the other
        if (char1 === undefined) return desc ? 1 : -1;
        if (char2 === undefined) return desc ? -1 : 1;
        
        // If characters are different, compare their positions
        if (char1 !== char2) {
            const index1 = alphOrder.indexOf(char1);
            const index2 = alphOrder.indexOf(char2);
            
            // Handle characters not found in alphOrder (sort them after known characters)
            const pos1 = index1 === -1 ? Infinity : index1;
            const pos2 = index2 === -1 ? Infinity : index2;
            
            if (pos1 !== pos2) {
                const result = pos1 - pos2;
                return desc ? -result : result;
            }
        }
    }
    
    // Strings are identical
    return 0;
}

/**
 * cropSVG alter the SVGs dimensions and/or viewBox to contain ONLY the paths within
 * @param {SVGSVGElement} svg an SVG whose only children is SVGPathElements
 * @returns {SVGSVGElement} a new SVG element. the original is not mutated
 */
export function cropSVG(svg) {
    // Examine the Lines and curves within the SVG to determine the new dimensions and/or viewbox of the new SVG element
    // Then return the new SVG element
    let tempSVG = svg.cloneNode(true);
    tempSVG.style.position = 'absolute';
    tempSVG.style.left = '-9999px';
    document.body.appendChild(tempSVG);
    
    let paths = tempSVG.querySelectorAll('path');
    let bbox = null;
    
    // Get the stroke width (default to 0 if not specified)
    let strokeWidth = 0;
    if (paths.length > 0) {
        const computedStyle = window.getComputedStyle(paths[0]);
        strokeWidth = parseFloat(computedStyle.strokeWidth) || 0;
    }
    
    // Calculate half the stroke width for padding
    const padding = strokeWidth / 2;
    
    for (let i = 0; i < paths.length; i++) {
        let rect = paths[i].getBBox();
        if (bbox === null) {
            bbox = rect;
        } else {
            let x = Math.min(bbox.x, rect.x);
            let y = Math.min(bbox.y, rect.y);
            let width = Math.max(bbox.x + bbox.width, rect.x + rect.width) - x;
            let height = Math.max(bbox.y + bbox.height, rect.y + rect.height) - y;
            bbox = { x, y, width, height };
        }
    }
    
    document.body.removeChild(tempSVG);
    
    if (bbox === null) {
        bbox = { x: 0, y: 0, width: 0, height: 0 };
    }
    
    // Apply padding to the bounding box
    const paddedBbox = {
        x: bbox.x - padding,
        y: bbox.y - padding,
        width: bbox.width + strokeWidth,
        height: bbox.height + strokeWidth
    };
    
    let newSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    
    for (let attr of svg.attributes) {
        if (attr.name !== 'viewBox' && attr.name !== 'width' && attr.name !== 'height') {
            newSVG.setAttribute(attr.name, attr.value);
        }
    }
    
    newSVG.setAttribute('viewBox', `${paddedBbox.x} ${paddedBbox.y} ${paddedBbox.width} ${paddedBbox.height}`);
    newSVG.setAttribute('width', paddedBbox.width);
    newSVG.setAttribute('height', paddedBbox.height);
    
    let originalPaths = svg.querySelectorAll('path');
    for (let i = 0; i < originalPaths.length; i++) {
        newSVG.appendChild(originalPaths[i].cloneNode(true));
    }
    
    return newSVG;
}
