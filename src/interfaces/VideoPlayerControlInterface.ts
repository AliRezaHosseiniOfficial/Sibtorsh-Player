import {RateInterface} from "./RateInterface.ts";

export interface VideoPlayerControlInterface {
    canPlay: boolean,
    isPlayed: boolean,
    isMuted: boolean,
    isShowControl: boolean,
    isError: boolean,
    currentTime: number,
    duration: number,
    // bufferedTime: number,
    bufferedRanges: { start: number, end: number }[],
    rates: RateInterface[]
    onMaximize?: () => void,
    onBackwardCurrentTime?: () => void,
    onForwardCurrentTime?: () => void,
    onDoubleClickInRight?: () => void,
    onDoubleClickInLeft?: () => void,
    onToggleMute?: () => void,
    onTogglePlay?: () => void,
    onChangeRate?: () => void,
    onSeek?: (time: number) => void,
    onTryAgain?: () => void
}