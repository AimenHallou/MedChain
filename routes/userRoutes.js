// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Get all users
router.get("/", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while querying the database." });
    } else {
      res.json(rows);
    }
  });
});

// Get a single user by address
router.get("/:address", (req, res) => {
  const address = req.params.address;
  db.get("SELECT * FROM users WHERE address = ?", [address], (err, row) => {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while querying the database." });
    } else {
      res.json(row);
    }
  });
});

// Create a user
router.post("/", (req, res) => {
  const { address, name, healthcareType, organizationName, notifications } =
    req.body;

  const updatedNotifications = notifications.map((notification) => ({
    ...notification,
    accepted: notification.accepted || false,
    rejected: notification.rejected || false,
  }));

  db.run(
    "INSERT INTO users(address, name, healthcareType, organizationName, notifications) VALUES(?, ?, ?, ?, ?)",
    [
      address,
      name,
      healthcareType,
      organizationName,
      JSON.stringify(updatedNotifications),
    ],
    function (err) {
      if (err) {
        res.status(500).json({
          error: "An error occurred while inserting into the database.",
        });
        return;
      }

      db.get("SELECT * FROM users WHERE address = ?", address, (err, row) => {
        if (err) {
          res
            .status(500)
            .json({ error: "An error occurred while querying the database." });
          return;
        }

        row.notifications = JSON.parse(row.notifications);

        res.json(row);
      });
    }
  );
});

// Update a user
router.put("/:address", (req, res) => {
  const address = req.params.address;
  const { name, healthcareType, organizationName, notifications } = req.body;

  const updatedNotifications = JSON.stringify(
    notifications.map((notification) => ({
      ...notification,
      accepted: notification.accepted || false,
      rejected: notification.rejected || false,
    }))
  );

  db.run(
    "UPDATE users SET name = ?, healthcareType = ?, organizationName = ?, notifications = ? WHERE address = ?",
    [name, healthcareType, organizationName, updatedNotifications, address],
    function (err) {
      if (err) {
        res
          .status(500)
          .json({ error: "An error occurred while updating the database." });
      } else {
        res.json({
          message: `User with address: ${address} updated successfully`,
        });
      }
    }
  );
});

// Delete a user
router.delete("/:address", (req, res) => {
  const address = req.params.address;
  db.run("DELETE FROM users WHERE address = ?", address, function (err) {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting from the database." });
    } else {
      res.json({
        message: `User with address: ${address} deleted successfully`,
      });
    }
  });
});

// Mark all notifications for a user as read
router.put("/:address/readNotifications", (req, res) => {
  const address = req.params.address;

  db.get(
    `SELECT notifications FROM users WHERE address = ?`,
    [address],
    (err, userRow) => {
      if (err) {
        return res.status(500).json({
          error: "Database query error",
          details: err.message,
        });
      }

      if (!userRow) {
        return res.status(404).json({
          error: `No user found with address: ${address}`,
        });
      }

      let notifications = JSON.parse(userRow.notifications || "[]");
      notifications = notifications.map((notif) => ({
        ...notif,
        read: true,
      }));

      db.run(
        `UPDATE users SET notifications = ? WHERE address = ?`,
        [JSON.stringify(notifications), address],
        function (err) {
          if (err) {
            return res.status(500).json({
              error: "Failed to update notifications in the database.",
              details: err.message,
            });
          }
          res.json({
            message: `All notifications for user with address: ${address} marked as read successfully`,
          });
        }
      );
    }
  );
  res.json(notifications);
});

module.exports = router;
