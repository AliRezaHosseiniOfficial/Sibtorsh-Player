import { useRef } from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import * as React from "react";

interface TransitionInterface {
    children: React.ReactElement;
    enterAnimateClass: string;
    exitAnimateClass: string;
    timeOut?: number;
    speedAnimateClass?: string;
    isVisible: boolean,
    className?: string
}

function Transition({
                        children,
                        enterAnimateClass,
                        exitAnimateClass,
                        timeOut = 500,
                        speedAnimateClass = 'fast',
                        isVisible, className
                    }: TransitionInterface) {
    const nodeRef = useRef<HTMLElement>(null);

    return (
        <SwitchTransition>
            <CSSTransition
                key={`${isVisible}`}
                nodeRef={nodeRef}
                timeout={timeOut}
                classNames={{
                    enter: `animate__animated animate__${enterAnimateClass} animate__${speedAnimateClass}`,
                    exit: `animate__animated animate__${exitAnimateClass} animate__${speedAnimateClass}`,
                }}
            >
                {isVisible
                    ? <section className={className} ref={nodeRef}>
                        {children}
                    </section>
                    : <></>}
            </CSSTransition>
        </SwitchTransition>
    );
}

export default Transition;