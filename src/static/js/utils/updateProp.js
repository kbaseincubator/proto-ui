
// Update handler for nested components
export function updateProp(component, prop) {
  if (!component.props.handleUpdate) {
    return;
  }
  return (updater) => {
    component.props.handleUpdate((state) => {
      const updated = updater(state[prop]);
      if (updated) {
        return Object.assign(state, {[prop]: updated});
      } else {
        return state;
      }
    });
  };
}

