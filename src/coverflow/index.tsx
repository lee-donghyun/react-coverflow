import { animated, useSpring, useSprings } from "@react-spring/web";
import { Handler, useGesture } from "@use-gesture/react";
import { useMemo, useReducer, useRef, useState } from "react";
import { Cover } from "./cover";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { Util as CoverUtil } from "./cover.util";
import { Util as ModalUtil } from "./modal.util";

const CLICK_AREA = 100;

enum State {
  IDLE,
  DRAGGING,
  MODAL,
}

const ts = [
  "Take Kare",
  "Quarterback",
  "Rarri",
  "Stunna",
  "Best Friend",
  "Power",
  "Calling Your Name",
  "No Way",
  "Mine",
  "Freaky",
  "Be Me See Me",
  "Overdosin",
  "Again",
  "That's All",
  "UDiggWhatImSayin",
  "Draw Down",
  "Wood Would",
  "Wanna Be Me",
];

const machine = (state: State, payload: State): State => {
  switch (state) {
    case State.IDLE:
      switch (payload) {
        case State.DRAGGING:
          return State.DRAGGING;
        case State.MODAL:
          return State.MODAL;
        default:
          return state;
      }
    case State.DRAGGING:
      switch (payload) {
        case State.IDLE:
          return State.IDLE;
        default:
          return state;
      }
    case State.MODAL:
      switch (payload) {
        case State.IDLE:
          return State.IDLE;
        default:
          return state;
      }
    default:
      return state;
  }
};
export const Coverflow = ({
  covers: coverData,
  size,
  backgroundColor,
  onChange,
  onSelected,
}: {
  covers: Parameters<typeof Cover>[0]["meta"][];
  size: number;
  backgroundColor: string;
  onChange?: (index: number) => void;
  onSelected?: (index: number) => void;
}) => {
  const clickPosition = useRef<null | { x: number; y: number }>(null);
  const memo = useRef<{ current: number; prevCurrent: number }>({
    current: 0,
    prevCurrent: 0,
  });

  const coverUtil = useMemo(() => new CoverUtil(size), [size]);
  const modalUtil = useMemo(() => new ModalUtil(), []);

  const [current, setCurrnet] = useState(0);
  const [state, dispatch] = useReducer(machine, State.IDLE);

  const [covers, coversApi] = useSprings(coverData.length, (score) => {
    return coverUtil.getTransform(score);
  });

  const [modal, modalApi] = useSpring(() => modalUtil.getInvisibleTransform());

  const setCurrentCover = (current: number) => {
    setCurrnet(current);
    onChange?.(current);
    onSelected?.(current);
    memo.current.prevCurrent = current;
    return coversApi.start((index) => {
      return coverUtil.getTransform(index - current);
    });
  };

  const clickHandler = (target: number) => {
    dispatch(State.MODAL);
    coversApi.start((index) => {
      if (index === target) {
        modalApi.start(modalUtil.getVisibleTransform());
        return modalUtil.getFlippedCoverTransform();
      }
    });
  };

  const dragHandler: Handler<"drag" | "wheel"> = ({
    movement: [movementX],
    active,
  }) => {
    if (active) {
      const { prevCurrent } = memo.current;

      const diffScore = coverUtil.getDiffScore(
        movementX,
        prevCurrent,
        covers.length
      );

      return coversApi.start((index) => {
        const score = index - prevCurrent + diffScore;
        if (Math.abs(score) <= 0.5) {
          setCurrnet(index);
          memo.current.current = index;
          onChange?.(index);
        }
        return coverUtil.getTransform(score);
      });
    }

    const current = memo.current.current;
    setCurrentCover(current);
  };

  const bind = useGesture(
    {
      onDrag: dragHandler,
      onWheel: dragHandler,
    },
    { drag: { keyboardDisplacement: size / 10 } }
  );

  return (
    <>
      <div
        style={{
          padding: `${size}px calc(50% - ${size / 2}px) ${size}px calc(50% - ${
            size / 2
          }px)`,
          overflow: "hidden",
        }}
      >
        <div
          {...bind()}
          style={{
            touchAction: "none",
            position: "relative",

            height: size,

            perspective: "600px",
            perspectiveOrigin: `calc(0% + ${size / 2}px) 50%`,
          }}
        >
          {covers.map((props, index) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <animated.div
              key={index}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: covers.length - Math.abs(current - index),
                ...props,
              }}
            >
              <Cover
                meta={coverData[index]}
                backgroundColor={backgroundColor}
                size={size}
                onMouseDown={(e) => {
                  const { x, y } = e.currentTarget.getBoundingClientRect();
                  clickPosition.current = { x, y };
                }}
                onMouseUp={(e) => {
                  if (clickPosition.current === null) {
                    return;
                  }

                  const { x, y } = e.currentTarget.getBoundingClientRect();
                  const { x: clickX, y: clickY } = clickPosition.current;
                  if (Math.hypot(clickX - x, clickY - y) > CLICK_AREA) {
                    return;
                  }

                  if (current === index) {
                    clickHandler(index);
                    return;
                  }

                  setCurrentCover(index);
                  clickPosition.current = null;
                }}
              />
            </animated.div>
          ))}
        </div>
      </div>
      <Dialog.Root
        open={state === State.MODAL}
        present
        onOpenChange={({ open }) => {
          if (!open) {
            dispatch(State.IDLE);
            modalApi.start(modalUtil.getInvisibleTransform());
            coversApi.start((index) => ({
              ...coverUtil.getTransform(index - current),
              delay: modalUtil.delay,
            }));
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              left: "0",
              overflow: "auto",
              position: "fixed",
              top: "0",
              width: "100vw",
              height: "100dvh",
              zIndex: "modal",
            }}
          >
            <Dialog.Content
              style={{
                perspective: "600px",
                perspectiveOrigin: `calc(0% + ${size / 2}px) 50%`,
              }}
            >
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <animated.div style={modal}>
                <div
                  style={{
                    width: size,
                    height: size,
                    padding: "2rem",
                    backgroundColor: "#FFF",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h2
                    style={{
                      backgroundImage: `url(${coverData[current].src})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      color: "rgb(0 0 0 / 20%)",
                      fontSize: "3rem",
                      lineHeight: "0.8",
                      letterSpacing: "-0.05em",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      backgroundClip: "text",
                    }}
                  >
                    Slime Season 3
                  </h2>
                  <ol
                    style={{
                      paddingLeft: "0",
                      marginTop: "2rem",
                      listStyleType: "none",
                      overflowY: "scroll",
                      flex: 1,
                    }}
                  >
                    {ts.map((title, index) => (
                      <li
                        key={index}
                        style={{
                          fontSize: "1rem",
                          fontFamily: "Inter, sans-serif",
                          letterSpacing: "-0.03em",
                          fontWeight: 700,
                          color: "rgb(0 0 0 / 80%)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.7rem",
                            display: "inline-block",
                            width: "1.2rem",
                          }}
                        >
                          {index}.
                        </span>
                        {title}
                      </li>
                    ))}
                  </ol>
                </div>
              </animated.div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
