
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// .>>>>>>>>>>>>>>>>>>>>> HEIGHT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 * @param {number} percentage - Height as a percentage (e.g., 10 for 10%)
 */
export const getResponsiveHeight = (percentage: number) => {
    return (SCREEN_HEIGHT * percentage) / 100;
};
// .>>>>>>>>>>>>>>>>>>>>> WIDTH >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/**
 * @param {number} percentage - Width as a percentage (e.g., 50 for 50%)
 */
export const getResponsiveWidth = (percentage: number) => {
    return (SCREEN_WIDTH * percentage) / 100;
};

// .>>>>>>>>>>>>>>>>>>>>> FONT SIZE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const BASE_WIDTH = 375;
/**
 * @param {number} pixels - The base font size in pixels
 * @returns {number} - The responsive font size
 */
export const getResponsiveFontSize = (pixels: number) => {
    return (SCREEN_WIDTH / BASE_WIDTH) * pixels;
};