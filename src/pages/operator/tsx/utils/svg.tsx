
import armDown from "operator/icons/Arm_Down.svg"
import armExtend from "operator/icons/Arm_Extend.svg"
import armRetract from "operator/icons/Arm_Retract.svg"
import armUp from "operator/icons/Arm_Up.svg"
import driveLeft from "operator/icons/Drive_Left.svg"
import driveRight from "operator/icons/Drive_Right.svg"
import gripClose from "operator/icons/Grip_Close.svg"
import gripLeft from "operator/icons/Grip_Left.svg"
import gripOpen from "operator/icons/Grip_Open.svg"
import gripRight from "operator/icons/Grip_Right.svg"
import driveForward from "operator/icons/Drive_FWD.svg"
import driveReverse from "operator/icons/Drive_RVS.svg"
import { ButtonPadButton } from "../functionprovider/buttonpads"
import { ButtonPadShape } from "../layoutcomponents/buttonpads"


/** The pixel width of SVG components. */
export const SVG_RESOLUTION = 500;

/**
 * Takes a percentage value and returns a pixel value based on {@link SVG_RESOLUTION}
 * 
 * @param percentage value between 0 and 100
 * @returns the pixel location
 * @example 0 -> 0, 50 -> resolution/2, 100 -> resolution
 */
export function percent2Pixel(percentage: number) {
    return SVG_RESOLUTION / 100 * percentage;
}

/**
 * Position and dimensions of the robot base from the overhead camera view
 */
export const OVERHEAD_ROBOT_BASE = {
    centerX: percent2Pixel(50),
    centerY: percent2Pixel(70),
    height: percent2Pixel(10),
    width: percent2Pixel(10)
}

/**Creates the SVG path for a rectangle
 * @param x left edge location
 * @param y top edge location
 * @param width the width
 * @param height the height
*/
export function rect(x: number, y: number, width: number, height: number) {
    return `M ${x} ${y} ${x + width} ${y} ${x + width} ${y + height} 
                ${x} ${y + height} Z`;
}
/** Represents the position and size of a box */
type BoxPosition = {
    centerX: number,
    centerY: number,
    height: number,
    width: number
}

/** Default box position with the box centered and a height and width 
 * of 10%
 */
const DEFAULT_POSITION = {
    centerX: percent2Pixel(50),
    centerY: percent2Pixel(50),
    height: percent2Pixel(10),
    width: percent2Pixel(10)
}

/**
 * Gets a list of path string descriptions for each button based on the {@link ButtonPadShape}
 * 
 * @param shape {@link ButtonPadShape} enum representing the shape of the button pad
 * @returns a list of strings where each string is a path description for the shape of a single button
 */
export function getPathsFromShape(shape: ButtonPadShape, aspectRatio?: number): [string[], { x: number, y: number }[]] {
    const width = SVG_RESOLUTION;
    const height = aspectRatio ? SVG_RESOLUTION / aspectRatio : SVG_RESOLUTION;
    switch (shape) {
        case (ButtonPadShape.Directional):
            return getDirectionalPaths(width, height);
        case (ButtonPadShape.Realsense):
            return getRealsenseManipPaths(width, height);
        case (ButtonPadShape.Gripper):
            return getGripperPaths(width, height);
    }
}

/**
 * Directional button pad made up of four trapazoids around a box in the 
 * center of the button pad.
 * 
 * @param onRobot if the square should be around the robot, centered if false
 */
function getDirectionalPaths(width: number, height: number, onRobot: boolean = true): [string[], { x: number, y: number }[]] {
    const boxPosition: BoxPosition = onRobot ? OVERHEAD_ROBOT_BASE : DEFAULT_POSITION;
    const { centerX, centerY, height: boxHeight, width: boxWidth } = boxPosition;
    const top = (centerY - boxHeight / 2) / width * height;
    const bot = (centerY + boxHeight / 2) / width * height;
    const lft = centerX - boxWidth / 2;
    const rgt = centerX + boxWidth / 2;

    const pathTop = `M 0 0 ${width} 0 ${rgt} ${top} ${lft} ${top} Z`
    const pathRgt = `M ${width} 0 ${width} ${height} 
                        ${rgt} ${bot} ${rgt} ${top} Z`
    const pathBot = `M 0 ${height} ${width} ${height} 
                        ${rgt} ${bot} ${lft} ${bot} Z`
    const pathLft = `M 0 0 0 ${height} ${lft} ${bot} ${lft} ${top} Z`

    const paths = [pathTop, pathRgt, pathBot, pathLft]
    const iconPositions = [
        { x: centerX, y: top / 2 },
        { x: (SVG_RESOLUTION + rgt) / 2, y: centerY },
        { x: centerX, y: (SVG_RESOLUTION + bot) / 2 },
        { x: (lft) / 2, y: centerY }
    ]
    return [paths, iconPositions];
}

/**
 * Ordered: top left, top right, then top, bottom, left, right trapezoids, then 
 * top and bottom center buttons, and finally bottom left and bottom right.
 */
function getRealsenseManipPaths(width: number, height: number): [string[], { x: number, y: number }[]] {
    /**Number of button layers from top to bottom in the display*/
    const numVerticalLayers = 6;
    /**How tall each layer of buttons should be.*/
    const layerHeight = height / numVerticalLayers;
    const centerWidth = percent2Pixel(30);
    const centerLeft = (width - centerWidth) / 2;
    const centerRight = centerLeft + centerWidth;
    const center = percent2Pixel(50);
    const paths = [
        // Top two buttons: left, right
        rect(0, 0, center, layerHeight),
        rect(center, 0, center, layerHeight),
        // Center directional trapezoid buttons: top, bottom, left, right
        `M 0 ${layerHeight} ${width} ${layerHeight} ${centerRight} ${layerHeight * 2} 
            ${centerLeft} ${layerHeight * 2} Z`,
        `M 0 ${layerHeight * 5} ${height} ${layerHeight * 5} 
            ${centerRight},${layerHeight * 4} ${centerLeft},${layerHeight * 4} Z`,
        `M 0 ${layerHeight} 0 ${layerHeight * 5} ${centerLeft},${layerHeight * 4} 
            ${centerLeft},${layerHeight * 2} Z`,
        `M ${width} ${layerHeight} ${width} ${layerHeight * 5} 
            ${centerRight},${layerHeight * 4} ${centerRight},${layerHeight * 2} Z`,
        // // Center two rectangle buttons: top, bottom
        rect(centerLeft, layerHeight * 2, centerWidth, layerHeight),
        rect(centerLeft, layerHeight * 3, centerWidth, layerHeight),
        // // Bottom two buttons: left, right
        rect(0, layerHeight * 5, center, layerHeight),
        rect(center, layerHeight * 5, center, layerHeight)
    ]
    const iconPositions = [
        // Top two
        { x: center / 2, y: layerHeight / 2 },
        { x: (width + center) / 2, y: layerHeight / 2 },
        // Center directional trapezoid buttons
        { x: width / 2, y: layerHeight * 3 / 2 },
        { x: width / 2, y: layerHeight * 9 / 2 },
        { x: centerLeft / 2, y: layerHeight * 6 / 2 },
        { x: (width + centerRight) / 2, y: layerHeight * 6 / 2 },
        // Center two rectangle buttons
        { x: width / 2, y: layerHeight * 5 / 2 },
        { x: width / 2, y: layerHeight * 7 / 2 },
        // Bottom two buttons
        { x: center / 2, y: layerHeight * 11 / 2 },
        { x: (width + center) / 2, y: layerHeight * 11 / 2 }
    ]
    return [paths, iconPositions];
}

/**
 * Ordered top, botton, left, right, larger center, smaller center
 */
function getGripperPaths(width: number, height: number): [string[], { x: number, y: number }[]] {
    /**Number of button layers from top to bottom in the display*/
    const numLayers = 5;
    /**How wide each layer of buttons should be.*/
    const xMargin = width / numLayers;
    /**How tall each layer of buttons should be.*/
    const yMargin = height / numLayers;
    const paths = [
        rect(0, 0, width, yMargin),  // top
        rect(0, height - yMargin, width, yMargin),  // bottom
        rect(0, yMargin, xMargin, yMargin * 3),  // left
        rect(width - xMargin, yMargin, xMargin, yMargin * 3), // right
        rect(xMargin, yMargin, xMargin * 3, yMargin * 3),  // gripper open
        rect(xMargin * 2, yMargin * 2, xMargin, yMargin)  // gripper close
    ]
    const iconPositions = [
        { x: width / 2, y: yMargin / 2 },  // top
        { x: width / 2, y: (2 * height - yMargin) / 2 },  // bottom
        { x: yMargin / 2, y: height / 2 },  // left
        { x: (2 * width - yMargin) / 2, y: height / 2 },  // right
        { x: yMargin * 7 / 2, y: height / 2 },  // gripper open
        { x: width / 2, y: height / 2 },  // gripper close
    ]
    return [paths, iconPositions];
}

/**
 * Gets the icon corresponding to a button in a button pad.
 * 
 * @param buttonPadButton 
 * @returns icon source
 */
export function getIcon(buttonPadButton: ButtonPadButton) {
    switch (buttonPadButton) {
        case (ButtonPadButton.BaseForward):
            return driveForward;
        case (ButtonPadButton.BaseReverse):
            return driveReverse;
        case (ButtonPadButton.BaseRotateRight):
            return driveRight;
        case (ButtonPadButton.BaseRotateLeft):
            return driveLeft;
        case (ButtonPadButton.ArmLift):
            return armUp;
        case (ButtonPadButton.ArmLower):
            return armDown;
        case (ButtonPadButton.ArmExtend):
            return armExtend;
        case (ButtonPadButton.ArmRetract):
            return armRetract;
        case (ButtonPadButton.GripperOpen):
            return gripOpen;
        case (ButtonPadButton.GripperClose):
            return gripClose;
        case (ButtonPadButton.WristRotateIn):
            return gripLeft;
        case (ButtonPadButton.WristRotateOut):
            return gripRight
        default:
            throw Error(`unknown button pad button\t${buttonPadButton}`);
    }
}