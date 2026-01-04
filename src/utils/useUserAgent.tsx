import {UAParser} from "ua-parser-js";

function useUserAgent() {
    const os = new UAParser().getResult().os.name;
    const browser = new UAParser()
        .getResult()
        .browser.name;
    const deviceType = new UAParser()
        .getResult()
        .device.type;

    return {
        os: {name: os},
        browser: {name: browser},
        device: {type: deviceType}
    }
}

export default useUserAgent