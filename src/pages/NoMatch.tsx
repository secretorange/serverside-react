import React from 'react';
import { Link } from 'react-router-dom';

export function NoMatch() {
    return (
      <div>
        <h2>No Match</h2>
        <p>
          <Link to="/">Home</Link>
        </p>
      </div>
    );
  }