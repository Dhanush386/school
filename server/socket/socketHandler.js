/**
 * socket/socketHandler.js
 * Socket.io event handler for School ERP.
 *
 * Responsibilities:
 *  - Maintain a live map of userId → socketId for online tracking.
 *  - Handle 'register' event from clients to associate their user ID.
 *  - Clean up the map on disconnect.
 *  - Export utility functions used by controllers/jobs:
 *      sendNotification(io, userId, data)  – push a notification to one user.
 *      getOnlineUsers()                    – return list of currently online user IDs.
 */

/**
 * userId (string) → socketId (string)
 * We store only one socket per user (last one wins).
 * Extend to an array if you need multi-device support.
 */
const onlineUsers = new Map();

/**
 * Initialise all Socket.io event listeners.
 * Call this once in server.js after creating the io instance:
 *   const socketHandler = require('./socket/socketHandler');
 *   socketHandler(io);
 *
 * @param {import('socket.io').Server} io
 */
const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ------------------------------------------------------------------
    // 'register' – client sends their userId so we can track them.
    // Payload: { userId: string }
    // ------------------------------------------------------------------
    socket.on('register', ({ userId } = {}) => {
      if (!userId) {
        console.warn(`⚠️  Socket ${socket.id} sent 'register' without a userId`);
        return;
      }

      // If the user was already connected from another tab/device,
      // remove the old mapping gracefully.
      const previousSocketId = onlineUsers.get(String(userId));
      if (previousSocketId && previousSocketId !== socket.id) {
        console.log(
          `ℹ️  User ${userId} re-connected. Old socket: ${previousSocketId} → New socket: ${socket.id}`
        );
      }

      onlineUsers.set(String(userId), socket.id);

      // Let the client know registration succeeded and share current online count
      socket.emit('registered', {
        success:       true,
        userId,
        onlineCount:   onlineUsers.size,
        timestamp:     new Date().toISOString(),
      });

      console.log(
        `👤 User '${userId}' registered with socket '${socket.id}'. ` +
        `Online users: ${onlineUsers.size}`
      );

      // Broadcast updated online user list to all connected clients (optional)
      io.emit('onlineUsersUpdated', { count: onlineUsers.size });
    });

    // ------------------------------------------------------------------
    // 'ping' – simple heartbeat / latency check from client
    // ------------------------------------------------------------------
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // ------------------------------------------------------------------
    // 'disconnect' – clean up the user mapping
    // ------------------------------------------------------------------
    socket.on('disconnect', (reason) => {
      // Find which userId owned this socketId
      let disconnectedUserId = null;

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId !== null) {
        onlineUsers.delete(disconnectedUserId);
        console.log(
          `❌ User '${disconnectedUserId}' disconnected (socket: ${socket.id}, reason: ${reason}). ` +
          `Online users: ${onlineUsers.size}`
        );
        // Broadcast updated online count
        io.emit('onlineUsersUpdated', { count: onlineUsers.size });
      } else {
        // Socket was never registered (e.g. anonymous connection)
        console.log(
          `❌ Unregistered socket disconnected: ${socket.id} (reason: ${reason})`
        );
      }
    });
  });
};

// ---------------------------------------------------------------------------
// sendNotification
// Emits a notification event to a specific user by their userId.
// If the user is not currently online, the notification is silently dropped
// (you may extend this to persist undelivered notifications in the DB).
//
// @param {import('socket.io').Server} io
// @param {string}                     userId  – MongoDB ObjectId as string
// @param {object}                     data    – arbitrary notification payload
// @returns {boolean}                          – true if delivered, false if user offline
// ---------------------------------------------------------------------------
const sendNotification = (io, userId, data) => {
  const socketId = onlineUsers.get(String(userId));

  if (!socketId) {
    console.log(
      `📭 Notification not delivered – user '${userId}' is offline.`
    );
    return false;
  }

  io.to(socketId).emit('notification', {
    ...data,
    deliveredAt: new Date().toISOString(),
  });

  console.log(
    `📬 Notification sent to user '${userId}' (socket: ${socketId})`
  );
  return true;
};

// ---------------------------------------------------------------------------
// getOnlineUsers
// Returns an array of userIds that currently have an active socket.
//
// @returns {string[]}
// ---------------------------------------------------------------------------
const getOnlineUsers = () => Array.from(onlineUsers.keys());

module.exports = socketHandler;
module.exports.sendNotification = sendNotification;
module.exports.getOnlineUsers   = getOnlineUsers;
