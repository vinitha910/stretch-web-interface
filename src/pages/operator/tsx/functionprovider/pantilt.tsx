import { FunctionProvider } from "./functionprovider"
import { PanTiltButtonDirection } from "../layoutcomponents/videostreamcomponent"
import{ JOINT_INCREMENTS } from 'shared/util'

export class PantiltFunctionProvider extends FunctionProvider {
    constructor() {
        super()
        this.provideFunctions = this.provideFunctions.bind(this)
    }

    public provideFunctions(direction: PanTiltButtonDirection): void {
        switch (direction) {
            case 'up':
                this.incrementalJointMovement('joint_head_tilt',  JOINT_INCREMENTS["joint_head_tilt"]! * FunctionProvider.velocityScale)
            case 'down':
                this.incrementalJointMovement('joint_head_tilt',  -1 * JOINT_INCREMENTS["joint_head_tilt"]! * FunctionProvider.velocityScale)
            case 'left':
                this.incrementalJointMovement('joint_head_pan',  JOINT_INCREMENTS["joint_head_pan"]! * FunctionProvider.velocityScale)
            case 'right':
                this.incrementalJointMovement('joint_head_pan',  -1 * JOINT_INCREMENTS["joint_head_pan"]! * FunctionProvider.velocityScale)
        }
    }
}