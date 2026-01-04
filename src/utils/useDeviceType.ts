import DeviceTypeEnum from "../enums/DeviceTypeEnum";
import {useEffect, useState} from "react";

export default function useDeviceType() {
    const [type, setType] = useState<DeviceTypeEnum>(DeviceTypeEnum.MOBILE)

    useEffect(() => {
        resize()
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    })

    const resize = () => {
        if (window.innerWidth > 1024) {
            setType(DeviceTypeEnum.DESKTOP) // lg
        } else {
            setType(DeviceTypeEnum.MOBILE)
        }
    }

    return type
}
