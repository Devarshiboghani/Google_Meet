import React, { useState } from 'react';
import VideoTile from './VideoTile';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';

const VideoGrid = ({ 
  localStream, 
  remoteStreams, 
  remoteParticipants, 
  localName, 
  localMediaState,
  remoteMediaStates 
}) => {
  const [pinnedId, setPinnedId] = useState(null);

  const togglePin = (id) => {
    setPinnedId(prev => prev === id ? null : id);
  };

  const allParticipants = [
    { id: 'local', name: localName, stream: localStream, isLocal: true, mediaState: localMediaState },
    ...remoteParticipants.map(p => ({
      id: p.socketId,
      name: p.name,
      stream: remoteStreams[p.socketId],
      isLocal: false,
      mediaState: remoteMediaStates[p.socketId] || { audio: true, video: true }
    }))
  ];

  // If a video is pinned, render Spotlight Layout
  if (pinnedId && allParticipants.find(p => p.id === pinnedId)) {
    const pinnedParticipant = allParticipants.find(p => p.id === pinnedId);
    const unpinnedParticipants = allParticipants.filter(p => p.id !== pinnedId);

    return (
      <div className="flex-1 w-full h-full flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        {/* Spotlight View */}
        <div className="flex-1 w-full h-full min-h-[300px]">
          <VideoTile 
            name={pinnedParticipant.name} 
            isLocal={pinnedParticipant.isLocal} 
            mediaState={pinnedParticipant.mediaState}
            isPinned={true}
            onPin={() => togglePin(pinnedParticipant.id)}
          >
            {pinnedParticipant.isLocal ? (
              <LocalVideo stream={pinnedParticipant.stream} />
            ) : (
              <RemoteVideo stream={pinnedParticipant.stream} />
            )}
          </VideoTile>
        </div>

        {/* Sidebar View */}
        {unpinnedParticipants.length > 0 && (
          <div className="w-full md:w-[240px] md:h-full flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
            {unpinnedParticipants.map(p => (
              <div key={p.id} className="w-[160px] md:w-full h-[120px] md:h-[160px] shrink-0">
                <VideoTile 
                  name={p.name} 
                  isLocal={p.isLocal} 
                  mediaState={p.mediaState}
                  isPinned={false}
                  onPin={() => togglePin(p.id)}
                >
                  {p.isLocal ? (
                    <LocalVideo stream={p.stream} />
                  ) : (
                    <RemoteVideo stream={p.stream} />
                  )}
                </VideoTile>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Calculate dynamic grid columns for standard layout
  const totalVideos = allParticipants.length;
  
  let gridCols = 'grid-cols-1';
  let gridRows = 'grid-rows-1';

  if (totalVideos === 2) {
    gridCols = 'grid-cols-1 md:grid-cols-2';
  } else if (totalVideos === 3 || totalVideos === 4) {
    gridCols = 'grid-cols-2';
    gridRows = 'grid-rows-2';
  } else if (totalVideos > 4) {
    gridCols = 'grid-cols-2 md:grid-cols-3';
    gridRows = 'grid-rows-2 md:grid-rows-3';
  }

  return (
    <div className={`flex-1 w-full h-full grid gap-4 p-4 ${gridCols} ${gridRows}`}>
      {allParticipants.map(p => (
        <div key={p.id} className="w-full h-full min-h-[200px]">
          <VideoTile 
            name={p.name} 
            isLocal={p.isLocal} 
            mediaState={p.mediaState}
            isPinned={false}
            onPin={() => togglePin(p.id)}
          >
            {p.isLocal ? (
              <LocalVideo stream={p.stream} />
            ) : (
              <RemoteVideo stream={p.stream} />
            )}
          </VideoTile>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
