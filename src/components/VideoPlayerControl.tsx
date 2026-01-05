import Transition from "../components/Transition";
import PlayCircleSvg from "../components/svg/PlaySvg";
import Loading from "../components/Loading";
import MaximizeSvg from "../components/svg/MaximizeSvg";
import BackwardSvg from "../components/svg/BackwardSvg";
import ForwardSvg from "../components/svg/ForwardSvg";
import VolumeUnMuteSvg from "../components/svg/UnMuteSvg";
import VolumeMuteSvg from "../components/svg/MuteSvg";
import {useEffect, useState} from "react";
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


    return <>
        <Transition
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            isVisible={canPlay && !isPlayed}
        >
            <div
                className={'absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center cursor-pointer'}
            >
                <MainControl>
                    <PlayCircleSvg
                        width={50}
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
                className={'absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center cursor-pointer bg-black/30 backdrop-blur-[1px]'}
            >
                <MainControl>
                    <RetrySvg width={50}/>
                </MainControl>
            </div>
        </Transition>
        <Transition
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            isVisible={!canPlay && !isError}
        >
            <div
                className={'absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center cursor-pointer bg-black/30 backdrop-blur-[1px]'}
            >
                <MainControl>
                    <Loading
                        classNames={"w-[50px]"}
                    />
                </MainControl>
            </div>
        </Transition>
        {canPlay && isPlayed
            ? <div
                onDoubleClick={() => {
                    onDoubleClickInRight?.()
                }}
                className={'absolute top-0 bottom-0 right-0 w-[50%] cursor-pointer'}
            >
            </div>
            : null}
        {canPlay && isPlayed
            ? <div
                onDoubleClick={() => {
                    onDoubleClickInLeft?.()
                }}
                className={'absolute top-0 bottom-0 left-0 w-[50%] cursor-pointer'}
            >
            </div>
            : null}
        <Transition
            className={`absolute bottom-10 left-12 right-12 flex flex-col gap-5 items-center`}
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            speedAnimateClass={'faster'}
            isVisible={canPlay && isPlayed && isShowControl}
        >
            <>
                <div className="w-full px-5 flex items-center"
                     onClick={(e) => e.stopPropagation()}>
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={(e) => onSeek?.(parseFloat(e.target.value))}
                        className="w-full h-3 appearance-none cursor-pointer rounded-full backdrop-blur-xs transition duration-500 bg-black/60"
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
                    className={`w-full flex justify-between items-center bg-black/40 rounded-full backdrop-blur-xs transition duration-500 px-5 py-3 ${deviceType === DeviceTypeEnum.MOBILE ? 'landscape:px-12' : ''}`}
                >
                    <div
                        className={`flex gap-3 items-center ${deviceType === DeviceTypeEnum.MOBILE ? 'landscape:gap-5' : ''}`}>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onMaximize?.()
                        }}>
                            {isFullScreen ? <MinimizeSvg width={30}/> : <MaximizeSvg width={30}/>}
                        </div>
                        <div className={'min-w-5 flex items-center justify-center cursor-pointer'}
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
                                <span className={'text-white font-bold text-lg'}>
                                    {first(filter(rates, (item: RateInterface) => {
                                        return item.active
                                    }))?.label}
                                </span>
                            </Transition>
                        </div>
                        <div className={'cursor-pointer'} onClick={(event) => {
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
                                        ? <VolumeUnMuteSvg width={30}/>

                                        : <VolumeMuteSvg width={30}/>
                                }
                            </Transition>
                        </div>
                    </div>
                    <div
                        className={`flex gap-3 items-center ${deviceType === DeviceTypeEnum.MOBILE ? 'landscape:gap-5' : ''}`}>
                        <div className={'flex gap-1 items-center rounded-full border border-white px-3 py-1'}>
                            <span className={'text-white text-sm tabular-nums'}>
                                {formatTime(duration)}
                            </span>
                            <span className={'text-white text-sm'}>
                                /
                            </span>
                            <span className={'text-white text-sm tabular-nums'}>
                                {formatTime(currentTime)}
                            </span>
                        </div>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onForwardCurrentTime?.()
                        }}>
                            <ForwardSvg width={30}/>
                        </div>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onBackwardCurrentTime?.()
                        }}>
                            <BackwardSvg width={30}/>
                        </div>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onTogglePlay?.()
                        }}>
                            <PauseSvg
                                width={30}/>
                        </div>
                    </div>
                </div>
            </>
        </Transition>
    </>
}

export default VideoPlayerControl