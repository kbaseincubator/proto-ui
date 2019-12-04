import React from 'react';

interface Props {
  loading: boolean;
}

// Loading spinner
export function LoadingSpinner(props: Props) {
  if (!props.loading) {
    return <></>;
  }
  return (
    <p className="black-60 mt3">
      <i className="fa fa-gear fa-spin"></i> Loading...
    </p>
  );
}
