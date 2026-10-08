/**
 * WebRTC (Web Real-Time Communication) Utilities & Learning Guide
 * 
 * 1. MediaStream
 *    A stream of media content. It consists of several tracks, such as video or audio tracks.
 *    Think of it as a container for your camera and microphone output natively supported by the browser.
 * 
 * 2. MediaStreamTrack
 *    Represents a single media track within a MediaStream (e.g., just the audio track, or just the video track).
 *    You can enable, disable, or stop individual tracks without destroying the entire stream.
 * 
 * 3. RTCPeerConnection
 *    The core of WebRTC. It represents a local end-point of a WebRTC connection. 
 *    It handles the reliable transmission of media streams and arbitrary data between two peers.
 *    It encapsulates complex networking logic like NAT traversal, packet loss handling, and encryption.
 * 
 * 4. SDP (Session Description Protocol)
 *    A standard format used to describe multimedia communication sessions.
 *    In WebRTC, peers exchange SDPs (known as 'Offer' & 'Answer') to agree on what media formats (codecs), 
 *    resolutions, and encryption parameters they will use before they start streaming directly.
 * 
 * 5. ICE (Interactive Connectivity Establishment) Candidates
 *    Because users are often behind routers and firewalls (NATs), direct IP-to-IP connections are hard.
 *    ICE candidates are network addresses (IP + Port) where a peer can potentially be reached.
 *    Peers exchange these candidates through the signaling server (our Socket.IO backend) to figure out the 
 *    best path to connect directly to each other (via STUN/TURN servers if needed).
 */

// Placeholder utility for creating a peer connection in the future
export const createPeerConnection = (config) => {
  return new RTCPeerConnection(config);g
};
