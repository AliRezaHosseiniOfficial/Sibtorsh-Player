import Transition from "@/components/Transition";
import PlayCircleSvg from "@/components/svg/PlaySvg";
import Loading from "@/components/Loading";
import MaximizeSvg from "@/components/svg/MaximizeSvg";
import BackwardSvg from "@/components/svg/BackwardSvg";
import ForwardSvg from "@/components/svg/ForwardSvg";
import VolumeUnMuteSvg from "@/components/svg/UnMuteSvg";
import VolumeMuteSvg from "@/components/svg/MuteSvg";
import React, {useEffect, useState} from "react";
import PauseSvg from "@/components/svg/PauseSvg";
import {formatTime} from "@/utils/DateUtils";
import {filter, first} from "lodash";
// import hexToRgba from "@/utils/HexToRgba";
import RetrySvg from "@/components/svg/RetrySvg.tsx";
import useDeviceType from "@/utils/useDeviceType";
import DeviceTypeEnum from "@/enums/DeviceTypeEnum";
import {VideoPlayerControlInterface} from "@/interfaces/VideoPlayerControlInterface.ts";
import {RateInterface} from "@/interfaces/RateInterface.ts";

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
                                onTryAgain
                            }: VideoPlayerControlInterface) {
    const [changeMute, setChangeMute] = useState(false)
    const [changeRate, setChangeRate] = useState(false)
    const deviceType = useDeviceType()


    const getBufferGradient = () => {
        if (!duration) return '';

        // const baseColor = hexToRgba(color ?? '', 0.3);
        // const playedColor = color;
        const bgColor = 'rgba(0,0,0,0.15)';

        const gradientParts: string[] = [];

        const playedPercent = (currentTime / duration) * 100;
        // gradientParts.push(`${playedColor} 0%`);
        // gradientParts.push(`${playedColor} ${playedPercent}%`);

        if (bufferedRanges.length === 0) {
            gradientParts.push(`${bgColor} ${playedPercent}%`);
            gradientParts.push(`${bgColor} 100%`);
        } else {
            let lastEndPercent = playedPercent;

            bufferedRanges.forEach((range) => {
                const startPercent = (range.start / duration) * 100;
                const endPercent = (range.end / duration) * 100;

                if (endPercent <= playedPercent) {
                    return;
                }

                if (startPercent > lastEndPercent) {
                    gradientParts.push(`${bgColor} ${lastEndPercent}%`);
                    gradientParts.push(`${bgColor} ${startPercent}%`);
                }

                // const safeStart = Math.max(startPercent, playedPercent);
                // gradientParts.push(`${baseColor} ${safeStart}%`);
                // gradientParts.push(`${baseColor} ${endPercent}%`);

                lastEndPercent = endPercent;
            });

            if (lastEndPercent < 100) {
                gradientParts.push(`${bgColor} ${lastEndPercent}%`);
                gradientParts.push(`${bgColor} 100%`);
            }
        }

        return `linear-gradient(to right, ${gradientParts.join(', ')})`;
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
                <PlayCircleSvg
                    width={50}
                />
            </div>
        </Transition>
        <Transition
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            isVisible={isError}
        >
            <div
                onClick={() => onTryAgain?.()}
                className={'absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center cursor-pointer bg-dark-surface/30 backdrop-blur-[1px]'}
            >
                <RetrySvg />
            </div>
        </Transition>
        <Transition
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            isVisible={!canPlay && !isError}
        >
            <div
                className={'absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center cursor-pointer bg-dark-surface/30 backdrop-blur-[1px]'}
            >
                <Loading
                    classNames={"w-[50px]"}
                />
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
            className={`absolute bottom-0 left-0 right-0 flex flex-col gap-1 items-center bg-dark-surface/50 rounded-lg backdrop-blur-md transition duration-500 px-3 pb-3 ${deviceType === DeviceTypeEnum.MOBILE ? 'landscape:px-12' : ''}`}
            enterAnimateClass={'fadeIn'}
            exitAnimateClass={'fadeOut'}
            speedAnimateClass={'faster'}
            isVisible={canPlay && isPlayed && isShowControl}
        >
            <>
                <div className="w-full px-1"
                     onClick={(event) => event.stopPropagation()}>
                    <input
                        type="range"
                        min={0}
                        max={duration}
                        step={0.1}
                        value={currentTime}
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
                        onChange={(event) => {
                            const value = parseFloat(event.target.value);
                            onSeek?.(value);
                        }}
                        className={`
                            w-full h-1 appearance-none bg-light-surface/30 rounded-lg cursor-pointer
                        `}
                        style={{
                            '--thumb-color': "#ffffff",
                            direction: "ltr",
                            background: getBufferGradient()
                            // background: `
                            //     linear-gradient(to right, ${color} 0%, ${color} ${(currentTime / duration) * 100}%,
                            //     ${hexToRgba(color ?? '', 0.5)} ${(currentTime / duration) * 100}%,
                            //     ${hexToRgba(color ?? '', 0.5)} ${(bufferedTime / duration) * 100}%,
                            //     rgba(0,0,0,0.15) ${(bufferedTime / duration) * 100}%, rgba(0,0,0,0.15) 100%)
                            // `
                        } as React.CSSProperties}
                    />
                </div>
                <div
                    onClick={(event) => event.stopPropagation()}
                    className={'w-full flex justify-between items-center'}
                >
                    <div
                        className={`flex gap-3 items-center ${deviceType === DeviceTypeEnum.MOBILE ? 'landscape:gap-5' : ''}`}>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onMaximize?.()
                        }}>
                            <MaximizeSvg
                                className={'fill-light-surface'}/>
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
                                <span className={'text-light-surface font-bold text-lg'}>
                                    {first(filter(rates, (item: RateInterface) => {
                                        return item.active
                                    }))?.label}
                                </span>
                            </Transition>
                        </div>
                    </div>
                    <div
                        className={`flex gap-3 items-center ${deviceType === DeviceTypeEnum.MOBILE ? 'landscape:gap-5' : ''}`}>
                        <div className={'flex gap-1 items-center'}>
                            <span className={'text-light-surface font-bold text-sm tabular-nums'}>
                                {formatTime(duration)}
                            </span>
                            <span className={'text-light-surface font-bold text-sm'}>
                                /
                            </span>
                            <span className={'text-light-surface font-bold text-sm tabular-nums'}>
                                {formatTime(currentTime)}
                            </span>
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
                                        ? <VolumeUnMuteSvg
                                            className={'fill-light-surface'}/>

                                        : <VolumeMuteSvg
                                            className={'fill-light-surface'}/>
                                }
                            </Transition>
                        </div>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onForwardCurrentTime?.()
                        }}>
                            <ForwardSvg
                                className={'fill-light-surface'}/>
                        </div>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onBackwardCurrentTime?.()
                        }}>
                            <BackwardSvg
                                className={'fill-light-surface'}/>
                        </div>
                        <div className={'cursor-pointer'} onClick={(event) => {
                            event.stopPropagation()
                            onTogglePlay?.()
                        }}>
                            <PauseSvg
                                width={20}
                                className={'fill-light-surface'}/>
                        </div>
                    </div>
                </div>
            </>
        </Transition>
    </>
}

export default VideoPlayerControl