import {Player} from "@lottiefiles/react-lottie-player";
import animationData from '@/assets/animations/loading.json';
import {cloneDeep} from "lodash";

function updateColor(data: any, newColor: string) {
    const traverse = (obj: any) => {
        if (obj && typeof obj === 'object') {
            if (obj.c && Array.isArray(obj.c.k)) {
                // اگر رنگ پیدا شد (در قالب [R, G, B])
                obj.c.k = hexToRgbArray(newColor);
            }
            Object.values(obj).forEach(traverse);
        }
    };

    traverse(data);
    return data;
}

function hexToRgbArray(hex: string) {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255];
}

function Loading({
                     classNames,
                     color = "#ffffff"
                 }: { classNames?: string, color?: string }) {
    const coloredAnimation = updateColor(cloneDeep(animationData), color);

    return (
        <Player
            className={classNames}
            autoplay
            loop
            src={coloredAnimation}
        />
    );
}

export default Loading;