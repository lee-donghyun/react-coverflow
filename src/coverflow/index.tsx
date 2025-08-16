import { animated, useSpring, useSprings } from "@react-spring/web";
import { Handler, useGesture } from "@use-gesture/react";
import { useMemo, useRef, useState } from "react";
import { Cover } from "./cover";
import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { Util as CoverUtil } from "./cover.util";
import { Util as ModalUtil } from "./modal.util";
import { make } from "./use-machine.hook";
import { FlippedCover } from "./flipped-cover";
import * as styles from "./index.css";

enum State {
  IDLE,
  DRAGGING,
  MODAL,
}

enum Event {
  DRAG,
  DRAG_DONE,
  OPEN_MODAL,
  CLOSE_MODAL,
}

enum Action {
  DRAG,
  DRAG_DONE,
  OPEN_MODAL,
  CLOSE_MODAL,
}

const useCoverflowMachine = make<
  State,
  Event,
  {
    [Action.DRAG]: (movementX: number) => State;
    [Action.DRAG_DONE]: () => State;
    [Action.OPEN_MODAL]: (target: number) => State;
    [Action.CLOSE_MODAL]: () => State;
  }
>({
  initial: State.IDLE,
  states: {
    [State.IDLE]: {
      [Event.DRAG]: Action.DRAG,
      [Event.OPEN_MODAL]: Action.OPEN_MODAL,
    },
    [State.DRAGGING]: {
      [Event.DRAG]: Action.DRAG,
      [Event.DRAG_DONE]: Action.DRAG_DONE,
    },
    [State.MODAL]: {
      [Event.CLOSE_MODAL]: Action.CLOSE_MODAL,
    },
  },
});

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
  const memo = useRef<{ current: number; prevCurrent: number }>({
    current: 0,
    prevCurrent: 0,
  });

  const coverUtil = useMemo(() => new CoverUtil(size), [size]);
  const modalUtil = useMemo(() => new ModalUtil(), []);

  const [current, setCurrnet] = useState(0);

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

  const { state, dispatch } = useCoverflowMachine({
    [Action.DRAG]: (movementX) => {
      const { prevCurrent } = memo.current;

      const diffScore = coverUtil.getDiffScore(
        movementX,
        prevCurrent,
        covers.length
      );

      coversApi.start((index) => {
        const score = index - prevCurrent + diffScore;
        if (Math.abs(score) <= 0.5) {
          setCurrnet(index);
          memo.current.current = index;
          onChange?.(index);
        }
        return coverUtil.getTransform(score);
      });

      return State.DRAGGING;
    },
    [Action.DRAG_DONE]: () => {
      const current = memo.current.current;
      setCurrentCover(current);
      return State.IDLE;
    },
    [Action.OPEN_MODAL]: (target) => {
      coversApi.start((index) => {
        if (index === target) {
          modalApi.start(modalUtil.getVisibleTransform());
          return modalUtil.getFlippedCoverTransform();
        }
      });
      return State.MODAL;
    },
    [Action.CLOSE_MODAL]: () => {
      modalApi.start(modalUtil.getInvisibleTransform());
      coversApi.start((index) => ({
        ...coverUtil.getTransform(index - current),
        delay: modalUtil.delay,
      }));
      return State.IDLE;
    },
  });

  const dragHandler: Handler<"drag" | "wheel"> = ({
    movement: [movementX],
    intentional,
    active,
  }) => {
    if (active && intentional) {
      dispatch(Event.DRAG, movementX);
      return;
    }
    dispatch(Event.DRAG_DONE);
  };

  const bind = useGesture(
    { onDrag: dragHandler, onWheel: dragHandler },
    { drag: { keyboardDisplacement: size / 10, threshold: 10 } }
  );

  return (
    <>
      <div
        className={styles.container}
        style={{
          padding: `${size}px calc(50% - ${size / 2}px) ${size}px calc(50% - ${
            size / 2
          }px)`,
        }}
      >
        <div
          {...bind()}
          className={styles.gesture_container}
          style={{
            height: size,
            perspectiveOrigin: `calc(0% + ${size / 2}px) 50%`,
          }}
        >
          {covers.map((props, index) => (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <animated.div
              key={index}
              className={styles.cover_item}
              style={{
                zIndex: covers.length - Math.abs(current - index),
                ...props,
              }}
            >
              <Cover
                meta={coverData[index]}
                backgroundColor={backgroundColor}
                size={size}
                onSelect={() => {
                  if (current === index) {
                    dispatch(Event.OPEN_MODAL, index);
                    return;
                  }
                  setCurrentCover(index);
                }}
              />
            </animated.div>
          ))}
        </div>
      </div>
      <Dialog.Root
        open={state === State.MODAL}
        lazyMount
        unmountOnExit
        present={state === State.MODAL || state === State.IDLE}
        onOpenChange={({ open }) => {
          if (!open) {
            dispatch(Event.CLOSE_MODAL);
          }
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner className={styles.modal_positioner}>
            <Dialog.Content
              className={styles.modal_content}
              style={{
                perspectiveOrigin: `calc(0% + ${size / 2}px) 50%`,
              }}
            >
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <animated.div style={modal}>
                <FlippedCover size={size} meta={coverData[current]} />
              </animated.div>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
