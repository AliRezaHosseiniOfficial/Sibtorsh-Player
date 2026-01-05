import VideoPlayerInterface from "./interfaces/VideoPlayerInterface";
import {useEffect, useRef, useState} from "react";
import VideoPlayerControl from "./components/VideoPlayerControl";
import useUserAgent from "./utils/useUserAgent";
import {debounce, findIndex} from "lodash";
import Hls from 'hls.js';
import useDeviceType from "./utils/useDeviceType.ts";
import DeviceTypeEnum from "./enums/DeviceTypeEnum.ts";
import usePWAInstalled from "./utils/usePWAInstalled.tsx";
import "./styles/video-player.css"
import "animate.css"

function VideoPlayer({
                         src,
                         reverseSrc,
                         poster,
                         keySrc,
                         onPlay,
                         onPause
                     }: VideoPlayerInterface) {
    const [canPlay, setCanPlay] = useState(false)
    const [isPlayed, setIsPlayed] = useState(false)
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const {os, browser} = useUserAgent()
    const deviceType = useDeviceType()
    const [isMuted, setIsMuted] = useState(false)
    const [safariIsFullscreen, setSafariIsFullscreen] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    // const [bufferedTime, setBufferedTime] = useState(0)
    const [bufferedRanges, setBufferedRanges] = useState<{ start: number, end: number }[]>([])
    const [isShowControl, setIsShowControl] = useState(false)
    const [isError, setIsError] = useState(false)
    const pwaInstalled = usePWAInstalled()
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [rates, setRates] = useState([
        {
            value: 0.5,
            label: "0.5x",
            active: false
        },
        {
            value: 1,
            label: "1x",
            active: true
        },
        {
            value: 1.25,
            label: "1.25x",
            active: false
        },
        {
            value: 1.5,
            label: "1.5x",
            active: false
        },
        {
            value: 1.75,
            label: "1.75x",
            active: false
        },
        {
            value: 2,
            label: "2x",
            active: false
        },
        {
            value: 2.5,
            label: "2.5x",
            active: false
        },
        {
            value: 3,
            label: "3x",
            active: false
        }
    ])
    const togglePlayTimeOut = useRef<any | null>(null);
    const longPressTimeOut = useRef<any | null>(null);
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const hlsRef = useRef<Hls | null>(null)

    const lastStatePlayBeforeOutViewPort = useRef(false)

    useEffect(() => {
        initialize()
        document.addEventListener("keypress", keyPressHandler)
        return () => {
            hlsRef.current?.destroy()
            hlsRef.current = null
            document.removeEventListener("keypress", keyPressHandler)
        }
    }, [src, keySrc]);

    function keyPressHandler(event: KeyboardEvent) {
        event.preventDefault()
        if (event.code.toUpperCase() === 'SPACE') {
            togglePlayHandle()
            // intersection()
        }
    }

    async function initialize() {
        if (!videoRef.current || !src) return;

        const isM3U8 = src.endsWith('.m3u8');

        if (Hls.isSupported() && isM3U8) {
            try {
                const hls = new Hls({
                    xhrSetup: function (xhr, url) {
                        if (url.includes('.key') && keySrc) {
                            xhr.open('GET', keySrc, true);
                        }
                    },
                    maxBufferLength: 30,
                    maxMaxBufferLength: 60,
                    maxBufferSize: 30 * 1000 * 1000,
                    maxBufferHole: 1,
                    startPosition: -1,
                    autoStartLoad: true
                });
                hls.on(Hls.Events.ERROR, function (_event, data) {
                    console.error("Hls error:", data)
                    // errorHandler()
                })
                hlsRef.current = hls;
                hls.loadSource(src);
                hls.attachMedia(videoRef.current);
            } catch {
                setIsError(true);
            }
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl') && isM3U8) {
            if (reverseSrc) {
                videoRef.current.src = reverseSrc;
            } else {
                // videoRef.current.src = '';
            }
        } else {
            videoRef.current.src = src;
        }

        videoRef.current.poster = poster ?? '';

        videoRef.current.addEventListener('canplay', canPlayHandler);
        videoRef.current.addEventListener('loadedmetadata', loadedMetaDataHandler);
        videoRef.current.addEventListener('play', playHandler);
        videoRef.current.addEventListener('pause', pauseHandler);
        videoRef.current.addEventListener('timeupdate', currentTimeHandler);
        videoRef.current.addEventListener('progress', progressHandler);
        videoRef.current.addEventListener('error', errorHandler);
        videoRef.current.addEventListener('playing', playingHandler);
        videoRef.current.addEventListener('waiting', waitingHandler);
        document.addEventListener("visibilitychange", visibilityChangeHandler)

        intersection()
    }

    useEffect(() => {
        if (canPlay && isPlayed) {
            setIsShowControl(true)
        }
    }, [canPlay, isPlayed]);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setIsShowControl(false)
        }, 10000)

        return () => {
            clearTimeout(timeOut)
        }
    }, [isShowControl]);

    function canPlayHandler() {
        setCanPlay(true);
        setIsError(false)
    }

    function errorHandler() {
        setIsError(true)
        setCanPlay(false)
        setIsPlayed(false)

        const error = videoRef.current?.error
        if (error) {
            switch (error.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                    console.log("خطا: بارگذاری ویدیو قطع شد.");
                    break;
                case MediaError.MEDIA_ERR_NETWORK:
                    console.log("خطا: مشکل شبکه هنگام بارگذاری ویدیو.");
                    break;
                case MediaError.MEDIA_ERR_DECODE:
                    console.log("خطا: مشکل در رمزگشایی فایل ویدیو.");
                    break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    console.log("خطا: فرمت یا سورس ویدیو پشتیبانی نمی‌شود.");
                    break;
                default:
                    console.log("خطای نامشخص در ویدیو.");
                    break;
            }
        } else {
            console.log("خطای ناشناخته در پخش ویدیو");
        }
    }

    // function progressHandler() {
    //     const bufferedRanges = (videoRef.current)?.buffered;
    //     if (bufferedRanges && bufferedRanges.length > 0) {
    //         const end = bufferedRanges.end(bufferedRanges.length - 1);
    //         setBufferedTime(end);
    //     }
    // }

    function progressHandler() {
        const video = videoRef.current;
        if (!video) return;

        const ranges: { start: number, end: number }[] = [];

        const buffered = video.buffered;

        for (let i = 0; i < buffered.length; i++) {
            const start = buffered.start(i);
            const end = buffered.end(i);
            ranges.push({start, end});
        }

        setBufferedRanges(ranges);
    }

    function loadedMetaDataHandler() {
        setCanPlay(true);
        setIsError(false)
        setDuration((videoRef.current)?.duration ?? 0)
    }

    function currentTimeHandler() {
        setCurrentTime((videoRef.current)?.currentTime ?? 0)
    }

    function visibilityChangeHandler() {
        videoRef.current?.pause()
    }

    function intersection() {
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                const v = e.target as HTMLVideoElement;
                if (e.intersectionRatio < 0.5) {
                    if (!v.paused && !v.ended) {
                        v.pause()
                        lastStatePlayBeforeOutViewPort.current = true
                    }
                } else if (e.isIntersecting) {
                    if (lastStatePlayBeforeOutViewPort.current) {
                        v.play().catch(() => {
                        })
                    }
                    lastStatePlayBeforeOutViewPort.current = false
                }
            }
        }, {threshold: [0, 0.5, 1]});

        io.observe(videoRef.current as HTMLVideoElement)
    }

    function playHandler() {
        setIsPlayed(true);
        onPlay?.()
    }

    function pauseHandler() {
        setIsPlayed(false)
        onPause?.()
    }

    function playingHandler() {
        setCanPlay(true);
        setIsPlayed(true);
    }

    function waitingHandler() {
        setCanPlay(false);
        setIsPlayed(false);
        setIsError(false)
    }

    async function maximizeHandler() {
        setIsFullScreen(prevState => !prevState)
        if (os.name?.toUpperCase().includes('IOS') || (browser.name?.toUpperCase().includes('SAFARI') && os.name?.toUpperCase().includes("MAC") && (deviceType === DeviceTypeEnum.MOBILE || pwaInstalled))) {
            if (safariIsFullscreen) {
                (videoRef.current)
                    ?.classList
                    .remove('!object-contain');
                (videoRef.current)
                    ?.parentElement
                    ?.classList
                    .remove('!z-[999]')
            } else {
                (videoRef.current)
                    ?.classList
                    .add('!object-contain');
                (videoRef.current)
                    ?.parentElement
                    ?.classList
                    .add('!z-[999]')
            }
            setSafariIsFullscreen(!safariIsFullscreen)
        } else {
            if (!document.fullscreenElement) {
                const el = videoRef.current?.parentElement;

                if (el) {
                    const requestFullscreen =
                        el.requestFullscreen ||
                        el.webkitRequestFullscreen ||
                        el.mozRequestFullScreen ||
                        el.msRequestFullscreen;

                    if (requestFullscreen) {
                        const fullscreenPromise = requestFullscreen.call(el);

                        if (fullscreenPromise) {
                            fullscreenPromise.catch((err) => {
                                console.error("Error attempting to enable full-screen mode:", err);
                            });
                        }
                    } else {
                        console.warn("Fullscreen API is not supported by this browser.");
                    }
                }
                (videoRef.current)
                    ?.classList
                    .add('!object-contain');
                (videoRef.current)
                    ?.parentElement
                    ?.classList
                    .add('!z-[9999999]')
            } else {
                await document.exitFullscreen();
                (videoRef.current)
                    ?.classList
                    .remove('!object-contain');
                (videoRef.current)
                    ?.parentElement
                    ?.classList
                    .remove('!z-[9999999]')
            }
            orientationLockHandle()
        }
    }

    useEffect(() => {
        orientationLockHandle();
    }, [safariIsFullscreen]);

    function forwardCurrentTimeHandler() {
        if (!videoRef.current) return;
        (videoRef.current).currentTime += 15;
    }

    function backwardCurrentTimeHandler() {
        if (!videoRef.current) return;
        (videoRef.current).currentTime -= 15;
    }

    function toggleMuteHandle() {
        if (!videoRef.current) return;
        if (isMuted) videoRef.current.muted = false
        else videoRef.current.muted = true

        setIsMuted(!isMuted)
    }

    function togglePlayHandle() {
        if (isPlayed) (videoRef.current)?.pause()
        else (videoRef.current)?.play()
    }

    function changeRateHandle() {
        let activeIndex = findIndex(rates, (item) => {
            return item.active
        })
        let rateValue = rates[activeIndex].value
        if (activeIndex + 1 == rates.length) {
            activeIndex = 0
        } else {
            activeIndex += 1
        }

        setRates(rates.map((item, index) => {
            if (index == activeIndex) {
                rateValue = item.value
                return {
                    value: item.value,
                    label: item.label,
                    active: true
                }
            } else {
                return {
                    value: item.value,
                    label: item.label,
                    active: false
                }
            }
        }))

        if (videoRef.current) videoRef.current.playbackRate = rateValue
    }

    function seekHandle(time: number) {
        if (videoRef.current) videoRef.current.currentTime = time;
    }

    function orientationLockHandle() {
        if (document.fullscreenElement || safariIsFullscreen) {
            document.body.classList.add('landscape-allowed');
        } else {
            document.body.classList.remove('landscape-allowed');
        }
    }

    const debouncedShowControlHandle = useRef(
        debounce(() => {
            setIsShowControl(true);
        })
    ).current;

    function tryAgainHandle() {
        setIsError(false)
        initialize()
    }

    function doubleClickInRightHandler() {
        if (togglePlayTimeOut.current) {
            clearTimeout(togglePlayTimeOut.current);
            togglePlayTimeOut.current = null;
        }
        forwardCurrentTimeHandler()
    }

    function doubleClickInLeftHandler() {
        if (togglePlayTimeOut.current) {
            clearTimeout(togglePlayTimeOut.current);
            togglePlayTimeOut.current = null;
        }
        backwardCurrentTimeHandler()
    }

    function startLongPressHandler() {
        setLongPressTriggered(false);
        longPressTimeOut.current = setTimeout(() => {
            setLongPressTriggered(true);
            setRates(rates.map((item) => {
                if (item.value == 2) {
                    return {
                        value: item.value,
                        label: item.label,
                        active: true
                    }
                } else {
                    return {
                        value: item.value,
                        label: item.label,
                        active: false
                    }
                }
            }))
            if (videoRef.current) videoRef.current.playbackRate = 2
        }, 1000)
    }

    function endLongPressHandler() {
        if (longPressTriggered) {
            setRates(rates.map((item) => {
                if (item.value == 1) {
                    return {
                        value: item.value,
                        label: item.label,
                        active: true
                    }
                } else {
                    return {
                        value: item.value,
                        label: item.label,
                        active: false
                    }
                }
            }))
            if (videoRef.current) videoRef.current.playbackRate = 1
        }
        if (longPressTimeOut.current) {
            clearTimeout(longPressTimeOut.current)
            longPressTimeOut.current = null
        }
    }

    return (
        <section
            onMouseMove={debouncedShowControlHandle}
            onTouchMove={debouncedShowControlHandle}
            onMouseDown={startLongPressHandler}
            onMouseUp={endLongPressHandler}
            onTouchStart={startLongPressHandler}
            onTouchEnd={endLongPressHandler}
            onClick={() => {
                if (longPressTriggered) {
                    setLongPressTriggered(false)
                    return;
                }
                if (togglePlayTimeOut.current !== null) {
                    clearTimeout(togglePlayTimeOut.current);
                    togglePlayTimeOut.current = null;
                }
                if (isPlayed) {
                    togglePlayTimeOut.current = setTimeout(() => {
                        (videoRef.current)?.pause()
                    }, 300)
                } else {
                    (videoRef.current)?.play()
                }
            }}
            style={{
                direction: "rtl"
            }}
            className={!safariIsFullscreen
                ? 'w-full h-full relative'
                : 'sp__fullscreen__safari'}>
            <video
                width={"100%"}
                height={"100%"}
                className={`w-full h-full object-cover`}
                ref={videoRef}
                playsInline
                webkit-playsinline={'true'}
                controls={false}
            />
            <VideoPlayerControl
                isError={isError}
                isShowControl={isShowControl}
                onSeek={seekHandle}
                // bufferedTime={bufferedTime}
                bufferedRanges={bufferedRanges}
                rates={rates}
                currentTime={currentTime}
                duration={duration}
                onTogglePlay={togglePlayHandle}
                isMuted={isMuted}
                onToggleMute={toggleMuteHandle}
                onBackwardCurrentTime={backwardCurrentTimeHandler}
                onForwardCurrentTime={forwardCurrentTimeHandler}
                onDoubleClickInRight={doubleClickInRightHandler}
                onDoubleClickInLeft={doubleClickInLeftHandler}
                onMaximize={maximizeHandler}
                canPlay={canPlay}
                isPlayed={isPlayed}
                onChangeRate={changeRateHandle}
                isFullScreen={isFullScreen}
                onTryAgain={tryAgainHandle}/>
        </section>
    );
}

export default VideoPlayer;
