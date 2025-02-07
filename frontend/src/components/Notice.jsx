-management-system/frontend/src/components/Notice.jsx
import React from 'react';

function Notice({ notice }) {
  return (
    <div>
      <h4>{notice.title}</h4>
      <p>{notice.content}</p>
      <small>{new Date(notice.date).toLocaleDateString()}</small>
    </div>
  );
}

export default Notice;