import * as React from 'react';
import { Button, TextField } from '@mui/material';

function MyComponent() {
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  applyBackgroundImage = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const body = document.body;
      body.style.backgroundImage = `url(${event.target.result})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <TextField
        type="file"
        variant="outlined"
        label="Select Background Image"
        onChange={handleFileChange}
        inputProps={{ accept: 'image/png, image/jpeg, image/gif' }}
      />
      {selectedFile && (
        <Button variant="contained" color="primary" onClick={() => applyBackgroundImage(selectedFile)}>
          Apply Background
        </Button>
      )}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <MyComponent />
  </React.StrictMode>,
  document.getElementById('root')
);