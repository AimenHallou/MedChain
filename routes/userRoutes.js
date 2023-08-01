// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all users
router.get('/', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({error: 'An error occurred while querying the database.'});
    } else {
      res.json(rows);
    }
  });
});

// Get a single user by address
router.get('/:address', (req, res) => {
  const address = req.params.address;
  db.get('SELECT * FROM users WHERE address = ?', [address], (err, row) => {
    if (err) {
      res.status(500).json({error: 'An error occurred while querying the database.'});
    } else {
      res.json(row);
    }
  });
});

// Create a user
router.post('/', (req, res) => {
  const { address, title, notifications } = req.body;

  const updatedNotifications = notifications.map(notification => ({
    ...notification,
    accepted: notification.accepted || false,
    rejected: notification.rejected || false,
  }));

  db.run('INSERT INTO users(address, title, notifications) VALUES(?, ?, ?)', [address, title, JSON.stringify(updatedNotifications)], function(err) {
    if (err) {
      res.status(500).json({error: 'An error occurred while inserting into the database.'});
      return;
    }

    db.get('SELECT * FROM users WHERE address = ?', address, (err, row) => {
      if (err) {
        res.status(500).json({error: 'An error occurred while querying the database.'});
        return;
      }

      row.notifications = JSON.parse(row.notifications);

      res.json(row);
    });
  });
});

// Update a user
router.put('/:address', (req, res) => {
  const address = req.params.address;
  const { title, notifications } = req.body;
  db.run('UPDATE users SET title = ?, notifications = ? WHERE address = ?', [title, notifications, address], function(err) {
    if (err) {
      res.status(500).json({error: 'An error occurred while updating the database.'});
    } else {
      res.json({ message: `User with address: ${address} updated successfully` });
    }
  });
});

// Delete a user
router.delete('/:address', (req, res) => {
  const address = req.params.address;
  db.run('DELETE FROM users WHERE address = ?', address, function(err) {
    if (err) {
      res.status(500).json({error: 'An error occurred while deleting from the database.'});
    } else {
      res.json({ message: `User with address: ${address} deleted successfully` });
    }
  });
});

module.exports = router;
