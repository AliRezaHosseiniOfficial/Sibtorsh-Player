export default interface VideoPlayerInterface {
    src: string,
    reverseSrc?: string,
    poster?: string,
    keySrc?: string,
    name: string,
    onPlay?: () => void,
    onPause?: () => void,
}