import { useState } from "react";

export const make = <
  State extends string | number | symbol,
  Event extends string | number | symbol,
  Actions extends {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in string | number | symbol]: (...payload: any[]) => State;
  }
>(machine: {
  initial: State;
  states: {
    [s in State]: {
      [a in Event]?: keyof Actions;
    };
  };
}) => {
  const useMachine = (actions: Actions) => {
    const [state, setState] = useState(machine.initial);

    const dispatch = <E extends Event>(
      event: E,
      ...payload: Parameters<Actions[E]>
    ) => {
      const actionName = machine.states[state]?.[event];
      if (actionName === undefined) {
        if (import.meta.env.DEV) {
          throw new Error(
            `Action ${event as string} is not defined for state ${
              state as string
            }`
          );
        }
        return;
      }
      const nextState = actions[actionName](...payload);
      setState(nextState);
    };

    return { state, dispatch };
  };
  return useMachine;
};
