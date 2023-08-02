import ROSLIB from "roslib"
import { ArucoMarkersInfo, ROSPose, RobotPose } from "./util"
import { ValidJoints } from "./util"

export type cmd = DriveCommand | IncrementalMove | setRobotModeCommand | CameraPerspectiveCommand | RobotPoseCommand | ToggleCommand | LookAtGripper | GetOccupancyGrid | MoveBaseCommand | StopTrajectoryCommand | StopMoveBaseCommand | PlaybackPosesCommand | UpdateArucoMarkersInfoCommand | SetArucoMarkerInfoCommand | GetRelativePoseCommand | NavigateToArucoCommand

export interface VelocityCommand {
    stop: () => void,
    affirm?: () => void
}

export interface DriveCommand {
    type: "driveBase",
    modifier: {
        linVel: number,
        angVel: number
    }
}

export interface IncrementalMove {
    type: "incrementalMove"
    jointName: ValidJoints,
    increment: number
}

export interface RobotPoseCommand {
    type: "setRobotPose"
    pose: RobotPose
}

export interface PlaybackPosesCommand {
    type: "playbackPoses"
    poses: RobotPose[]
}

export interface setRobotModeCommand {
    type: "setRobotMode",
    modifier: "position" | "navigation"
}

export interface CameraPerspectiveCommand {
    type: "setCameraPerspective"
    camera: "overhead" | "realsense" | "gripper"
    perspective: string
}

export interface ToggleCommand {
    type: "setFollowGripper" | "setDepthSensing" | "setArucoMarkers"
    toggle: boolean
}

export interface LookAtGripper {
    type: "lookAtGripper"
}

export interface GetOccupancyGrid {
    type: "getOccupancyGrid"
}

export interface MoveBaseCommand {
    type: "moveBase"
    pose: ROSPose
}

export interface NavigateToArucoCommand {
    type: "navigateToAruco"
    name: string
    pose: ROSLIB.Transform
}

export interface StopTrajectoryCommand {
    type: "stopTrajectory"
}

export interface StopMoveBaseCommand {
    type: "stopMoveBase"
}

export interface UpdateArucoMarkersInfoCommand {
    type: "updateArucoMarkersInfo"
}

export interface SetArucoMarkerInfoCommand {
    type: "setArucoMarkerInfo"
    info: ArucoMarkersInfo
}

export interface GetRelativePoseCommand {
    type: "getRelativePose"
    marker_name: string
}