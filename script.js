let recording = [];
let tracks = [];
let isRecording = false;
let startTime;

function startRecording() {
  recording = [];
  startTime = Date.now();
  isRecording = true;
}

function stopRecording() {
  isRecording = false;
  if (recording.length > 0) {
    tracks.push([...recording]);
    updateTracksList();
  }
}

function playTrack(index) {
  const track = tracks[index];
  if (!track) return;
  for (let note of track) {
    setTimeout(() => {
      playSound(note.keyCode);
    }, note.time);
  }
}

function deleteTrack(index) {
  tracks.splice(index, 1);
  updateTracksList();
}

function downloadTrack(index) {
  const track = tracks[index];
  if (!track) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(track));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `track${index + 1}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
}

document.addEventListener('keydown', function(event) {
  playSound(event.keyCode);

  if (isRecording) {
    recording.push({
      keyCode: event.keyCode,
      time: Date.now() - startTime
    });
  }
});

document.querySelectorAll('.key').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.getAttribute('data-key');
    playSound(Number(key));
    if (isRecording) {
      recording.push({
        keyCode: Number(key),
        time: Date.now() - startTime
      });
    }
  });
});

function playSound(keyCode) {
  const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play();
}

function updateTracksList() {
  const trackListDiv = document.getElementById('track-list');
  trackListDiv.innerHTML = '';

  tracks.forEach((track, index) => {
    const container = document.createElement('div');

    const playBtn = document.createElement('button');
    playBtn.innerText = `Play Track ${index + 1} 🎵`;
    playBtn.onclick = () => playTrack(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '🗑️ Delete';
    deleteBtn.onclick = () => deleteTrack(index);

    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = '⬇️ Download';
    downloadBtn.onclick = () => downloadTrack(index);

    container.appendChild(playBtn);
    container.appendChild(deleteBtn);
    container.appendChild(downloadBtn);

    trackListDiv.appendChild(container);
  });
}
