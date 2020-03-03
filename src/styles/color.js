export default {
    base:'#9900E0',
    baseLight:'#7000A5',
    secondaryBase: '#EE007D',
    lightGrey: '#ccced1',
    black: '#000',
    blue: '#428AF8',
    primary: '#FFF',
    primaryLight: '#979D96',
    secondary: '#63E311',
    secondaryLight: '#BCF718',
    yellow: '#F8E818',
    grey:'#E5E6E7',
    orange: '#EC9617',
    secondaryText: '#3B9700',
    secondaryBg: '#4CC000',
    noteBG: '#A5DA91'
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

export const colorwAlpha = (color, alpha) => {
    const res = hexToRgb(color)
    return `rgba(${res.r},${res.g},${res.b},${alpha})`
}