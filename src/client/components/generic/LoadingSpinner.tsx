import React, { Component } from 'react';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  loading: boolean;
}

// Loading spinner
export function LoadingSpinner(props: Props) {
  if (!props.loading) {
    return <></>;
  }
  return (
    <div style={{ margin: 'auto', textAlign: 'center' }}>
      <p className="black-60 mt3">Loading...</p>
      <Spinner animation="grow" size="sm" />
      <Spinner animation="border" variant="primary" />
      <Spinner animation="grow" variant="primary" />
    </div>
  );
}
