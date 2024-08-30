const uploadForm = document.getElementById('upload-form');

uploadForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(uploadForm);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    alert(data);
  })
  .catch(error => console.error('Error:', error));
});


// Initialize Quill editor
var quill = new Quill('#editor-container', {
    theme: 'snow'
  });
  
  // Initialize Socket.IO
  const socket = io();
  
  // Send content to the server whenever it changes
  quill.on('text-change', () => {
    const content = quill.root.innerHTML;
    socket.emit('contentUpdate', content);
  });
  
  // Listen for content updates from the server
  socket.on('updateContent', (content) => {
    quill.root.innerHTML = content;
  });
  
  // Handle file uploads
  const uploadForm = document.getElementById('upload-form');
  
  uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formData = new FormData(uploadForm);
    
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      alert(data);
      // Optionally, emit a file upload event
      socket.emit('fileUpload', { fileName: formData.get('file').name });
    })
    .catch(error => console.error('Error:', error));
  });
  
  // Listen for file upload notifications
  socket.on('notifyFileUpload', (file) => {
    console.log('New file uploaded:', file);
    // Update the UI with the new file if needed
  });

  
  socket.on('notifyFileUpload', (file) => {
    const fileList = document.getElementById('file-list');
    const listItem = document.createElement('li');
    listItem.textContent = file.fileName;
    fileList.appendChild(listItem);
  });

  
  socket.on('notifyFileUpload', (file) => {
    const fileList = document.getElementById('file-list');
    const listItem = document.createElement('li');
    const fileLink = document.createElement('a');
    fileLink.href = `/uploads/${file.fileName}`;
    fileLink.textContent = file.fileName;
    fileLink.target = '_blank';
    listItem.appendChild(fileLink);
    fileList.appendChild(listItem);
  });
  
  
  // Function to save content
  function saveContent() {
    const content = quill.root.innerHTML;
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: content })
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      alert('Content saved successfully!');
    })
    .catch(error => console.error('Error:', error));
  }

  // Handle file deletions
function deleteFile(fileName) {
    fetch(`/delete/${fileName}`, {
      method: 'DELETE'
    })
    .then(response => response.text())
    .then(data => {
      alert(data);
    })
    .catch(error => console.error('Error:', error));
  }
  
  // Update file list with delete buttons
  socket.on('notifyFileUpload', (file) => {
    const fileList = document.getElementById('file-list');
    const listItem = document.createElement('li');
    const fileLink = document.createElement('a');
    fileLink.href = `/uploads/${file.fileName}`;
    fileLink.textContent = file.fileName;
    fileLink.target = '_blank';
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteFile(file.fileName));
  
    listItem.appendChild(fileLink);
    listItem.appendChild(deleteButton);
    fileList.appendChild(listItem);
  });
  
  socket.on('notifyFileDeletion', (fileName) => {
    const fileList = document.getElementById('file-list');
    const items = fileList.getElementsByTagName('li');
  
    for (let i = 0; i < items.length; i++) {
      if (items[i].textContent.includes(fileName)) {
        fileList.removeChild(items[i]);
        break;
      }
    }
  });
  
  
  // Example: Save content when user presses a button (add this button in your HTML)
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save Content';
  document.body.appendChild(saveButton);
  saveButton.addEventListener('click', saveContent);
  