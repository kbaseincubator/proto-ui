
// Update handler for nested components
export function updateProp(state, prop) {
  return (childstate) => {
    state.update(Object.assign(state, {[prop]: childstate}));
  };
}

