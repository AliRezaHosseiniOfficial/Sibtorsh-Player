import Transition from "../components/Transition";
import PlayCircleSvg from "../components/svg/PlaySvg";
import Loading from "../components/Loading";
import MaximizeSvg from "../components/svg/MaximizeSvg";
import BackwardSvg from "../components/svg/BackwardSvg";
import ForwardSvg from "../components/svg/ForwardSvg";
import VolumeUnMuteSvg from "../components/svg/UnMuteSvg";
import VolumeMuteSvg from "../components/svg/MuteSvg";
import {useEffect, useRef, useState} from "react";
import PauseSvg from "../components/svg/PauseSvg";
import {formatTime} from "../utils/DateUtils";
import {filter, first} from "lodash";
// import hexToRgba from "@/utils/HexToRgba";
import RetrySvg from "../components/svg/RetrySvg.tsx";
import useDeviceType from "../utils/useDeviceType";
import DeviceTypeEnum from "../enums/DeviceTypeEnum";
import {VideoPlayerControlInterface} from "../interfaces/VideoPlayerControlInterface.ts";
import {RateInterface} from "../interfaces/RateInterface.ts";
import MainControl from "./MainControl.tsx";
import MinimizeSvg from "./svg/MinimizeSvg.tsx";
import PlaySvg from "../components/svg/PlaySvg";
import {MouseEvent} from "react"

function VideoPlayerControl({
                                canPlay,
                                isPlayed,
                                isMuted,
                                isShowControl,
                                isError,
                                currentTime,
                                duration,
                                bufferedRanges,
                                rates,
                                onMaximize,
                                onBackwardCurrentTime,
                                onForwardCurrentTime,
                                onDoubleClickInRight,
                                onDoubleClickInLeft,
                                onToggleMute,
                                onTogglePlay,
                                onChangeRate,
                                onSeek,
                                onTryAgain,
                                isFullScreen
                            }: VideoPlayerControlInterface) {
    const [changeMute, setChangeMute] = useState(false)
    const [changeRate, setChangeRate] = useState(false)
    const deviceType = useDeviceType()
    const tooltip = useRef<HTMLDivElement>(null)
    const [tooltipTime, setTooltipTime] = useState(0)
    const [isShowTooltip, setIsShowTooltip] = useState(false)
    const [isMouseOnRange, setIsMouseOnRange] = useState(false)

    const getBufferGradient = () => {
        if (!duration) return '';

        const playedPercent = (currentTime / duration) * 100;

        const playedGradient = `linear-gradient(to right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,1) ${playedPercent}%, transparent ${playedPercent}%)`;

        const bufferColor = "rgba(0, 0, 0, 0.6)";
        const trackBg = "rgba(255, 255, 255, 0.1)";

        let bufferParts = [`transparent ${playedPercent}%`];

        if (bufferedRanges.length > 0) {
            bufferedRanges.forEach((range) => {
                const start = (range.start / duration) * 100;
                const end = (range.end / duration) * 100;

                if (end <= playedPercent) return;

                const safeStart = Math.max(start, playedPercent);
                bufferParts.push(`${bufferColor} ${safeStart}%`, `${bufferColor} ${end}%`);
            });
        }

        bufferParts.push(`${trackBg} ${playedPercent}%`, `${trackBg} 100%`);

        const secondaryGradient = `linear-gradient(to right, ${bufferParts.join(', ')})`;

        // ترکیب هر دو لایه
        return `${playedGradient}, ${secondaryGradient}`;
    };

    useEffect(() => {
        setChangeMute(true)

        const timeOut = setTimeout(() => {
            setChangeMute(false)
        }, 100)

        return () => {
            clearTimeout(timeOut)
        }
    }, [isMuted])

    useEffect(() => {
        setChangeRate(true)

        const timeOut = setTimeout(() => {
            setChangeRate(false)
        }, 100)

        return () => {
            clearTimeout(timeOut)
        }
    }, [rates])

    const onMouseMove = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()

        const x = e.clientX - rect.left
        const percent = Math.min(Math.max(x / rect.width, 0), 1)
        const time = percent * duration

        setTooltipTime(time)

        if (tooltip.current) {
            tooltip.current.style.left = `${x}px`
        }

        setIsShowTooltip(true)

        setTimeout(() => {
            if (!isMouseOnRange) {
                setIsShowTooltip(false)
            }
        }, 1000)
    }


    return <>
        <Transition
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            isVisible={canPlay && !isPlayed}
        >
            <div
                className={'sp:absolute sp:top-0 sp:bottom-0 sp:left-0 sp:right-0 sp:flex sp:justify-center sp:items-center sp:cursor-pointer'}
            >
                <MainControl>
                    <PlayCircleSvg
                        width={3}
                    />
                </MainControl>
            </div>
        </Transition>
        <Transition
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            isVisible={isError}
        >
            <div
                onClick={() => onTryAgain?.()}
                className={'sp:absolute sp:top-0 sp:sp:bottom-0 sp:left-0 sp:right-0 sp:flex sp:justify-center sp:items-center sp:cursor-pointer sp:bg-black/30 sp:backdrop-blur-[1px]'}
            >
                <MainControl>
                    <RetrySvg width={2}/>
                </MainControl>
            </div>
        </Transition>
        <Transition
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            isVisible={!canPlay && !isError}
        >
            <div
                className={'sp:absolute sp:top-0 sp:bottom-0 sp:left-0 sp:right-0 sp:flex sp:justify-center sp:items-center sp:cursor-pointer sp:bg-black/30 sp:backdrop-blur-[1px]'}
            >
                <MainControl>
                    <Loading
                        classNames={"sp:w-[50px]"}
                    />
                </MainControl>
            </div>
        </Transition>
        {canPlay && isPlayed
            ? <div
                onDoubleClick={() => {
                    onDoubleClickInRight?.()
                }}
                className={'sp:absolute sp:top-0 sp:bottom-0 sp:right-0 sp:w-[50%] sp:cursor-pointer'}
            >
            </div>
            : null}
        {canPlay && isPlayed
            ? <div
                onDoubleClick={() => {
                    onDoubleClickInLeft?.()
                }}
                className={'sp:absolute sp:top-0 sp:bottom-0 sp:left-0 sp:w-[50%] sp:cursor-pointer'}
            >
            </div>
            : null}
        <Transition
            className={`sp:absolute sp:bottom-[1em] sp:left-[1em] sp:right-[1em] sp:flex sp:flex-col sp:gap-[0.7em] sp:items-center`}
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            speedAnimateClass={'faster'}
            isVisible={canPlay && isShowControl}
        >
            <>
                <div className="sp:w-full sp:px-[1em] sp:flex sp:items-center sp:relative"
                     onClick={(e) => e.stopPropagation()}>
                    <div
                        style={{
                            left: `${(currentTime / duration) * 100}%`,
                            transform: `translateX(-${(currentTime / duration) * 100}%)`
                        }}
                        className={'sp:absolute sp:bg-black sp:border-4 sp:border-white sp:rounded-full sp:px-[0.3em] sp:py-[0.3em] sp:transition sp:duration-500 sp:w-[1.3em] sp:h-[1.3em] sp:z-[999]'}>
                    </div>
                    <Transition enterAnimateClass={'fadeIn'} exitAnimateClass={'fadeOut'} isVisible={isShowTooltip}>
                        <span
                            ref={tooltip}
                            className={'sp:absolute sp:bg-white/60 sp:bottom-[1.5em] sp:rounded-full sp:px-[0.7em] sp:py-[0.3em] sp:backdrop-blur-md sp:text-xs sp:transition sp:text-center sp:duration-500 sp:tabular-nums'}>
                        {formatTime(tooltipTime)}
                    </span>
                    </Transition>
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onMouseEnter={() => {
                            setIsShowTooltip(true)
                            setIsMouseOnRange(true)
                        }}
                        onMouseLeave={() => {
                            setIsShowTooltip(false)
                            setIsMouseOnRange(false)
                        }}
                        onMouseMove={onMouseMove}
                        onChange={(e) => onSeek?.(parseFloat(e.target.value))}
                        className="sp:w-full sp:h-3 sp:appearance-none sp:cursor-pointer sp:rounded-full sp:backdrop-blur-xs sp:transition sp:duration-500 sp:bg-black/60"
                        style={{
                            direction: "ltr",
                            backgroundImage: getBufferGradient(),
                            backgroundSize: '100% 100%',
                            outline: 'none',
                        }}
                    />

                </div>
                <div
                    onClick={(event) => event.stopPropagation()}
                    className={`sp:w-full sp:flex sp:justify-between sp:items-center sp:bg-black/40 sp:rounded-full sp:backdrop-blur-xs sp:transition sp:duration-500 sp:px-[0.7em] sp:py-[0.7em] ${deviceType === DeviceTypeEnum.MOBILE ? 'sp:landscape:px-[1em]' : ''}`}
                >
                    <div
                        className={`sp:flex sp:gap-[0.7em] sp:items-center ${deviceType === DeviceTypeEnum.MOBILE ? 'sp:landscape:gap-[1em]' : ''}`}>
                        <div className={'sp:cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onMaximize?.()
                        }}>
                            {isFullScreen ? <MinimizeSvg width={1.5}/> : <MaximizeSvg width={1.5}/>}
                        </div>
                        <div className={'sp:min-w-5 sp:flex sp:items-center sp:justify-center sp:cursor-pointer'}
                             onMouseUp={(event) => {
                                 event.stopPropagation()
                             }}
                             onMouseDown={(event) => {
                                 event.stopPropagation()
                             }}
                             onTouchStart={(event) => {
                                 event.stopPropagation()
                             }}
                             onTouchEnd={(event) => {
                                 event.stopPropagation()
                             }}
                             onClick={(event) => {
                                 event.stopPropagation()
                                 onChangeRate?.()
                             }}>
                            <Transition
                                enterAnimateClass={'heartBeat'}
                                exitAnimateClass={'heartBeat'}
                                speedAnimateClass={'faster'}
                                isVisible={!changeRate}>
                                <span className={'sp:text-white sp:font-bold sp:text-lg'}>
                                    {first(filter(rates, (item: RateInterface) => {
                                        return item.active
                                    }))?.label}
                                </span>
                            </Transition>
                        </div>
                        <div className={'sp:cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onToggleMute?.()
                        }}>
                            <Transition
                                enterAnimateClass={'heartBeat'}
                                exitAnimateClass={'heartBeat'}
                                speedAnimateClass={'faster'}
                                isVisible={!changeMute}>
                                {
                                    !isMuted
                                        ? <VolumeUnMuteSvg width={1.5}/>

                                        : <VolumeMuteSvg width={1.5}/>
                                }
                            </Transition>
                        </div>
                    </div>
                    <div
                        className={`sp:flex sp:gap-[0.7em] sp:items-center ${deviceType === DeviceTypeEnum.MOBILE ? 'sp:landscape:gap-[1em]' : ''}`}>
                        <div
                            className={'sp:flex sp:gap-[0.3em] sp:items-center sp:rounded-full sp:border sp:border-white sp:px-3 sp:py-1'}>
                            <span className={'sp:text-white sp:text-sm sp:tabular-nums'}>
                                {formatTime(duration)}
                            </span>
                            <span className={'sp:text-white sp:text-sm'}>
                                /
                            </span>
                            <span className={'sp:text-white sp:text-sm sp:tabular-nums'}>
                                {formatTime(currentTime)}
                            </span>
                        </div>
                        <div className={'sp:cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onForwardCurrentTime?.()
                        }}>
                            <ForwardSvg width={1.5}/>
                        </div>
                        <div className={'sp:cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onBackwardCurrentTime?.()
                        }}>
                            <BackwardSvg width={1.5}/>
                        </div>
                        <div className={'sp:cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onTogglePlay?.()
                        }}>
                            {
                                isPlayed
                                    ? <PauseSvg
                                        width={1.5}/>
                                    : <PlaySvg
                                        width={1.5}/>
                            }
                        </div>
                    </div>
                </div>
            </>
        </Transition>
    </>
}

export default VideoPlayerControl