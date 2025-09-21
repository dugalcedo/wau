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
