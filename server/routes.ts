import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Channel routes
  app.get("/api/channels", async (req, res) => {
    try {
      const channels = await storage.getChannels();
      res.json(channels);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/channels/category/:category", async (req, res) => {
    try {
      const channels = await storage.getChannelsByCategory(req.params.category);
      res.json(channels);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/channels/:id", async (req, res) => {
    try {
      const channel = await storage.getChannel(req.params.id);
      if (!channel) {
        return res.status(404).json({ message: "Channel not found" });
      }
      res.json(channel);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Movie routes
  app.get("/api/movies", async (req, res) => {
    try {
      const movies = await storage.getMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/movies/featured", async (req, res) => {
    try {
      const movies = await storage.getFeaturedMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/movies/:id", async (req, res) => {
    try {
      const movie = await storage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Series routes
  app.get("/api/series", async (req, res) => {
    try {
      const series = await storage.getSeries();
      res.json(series);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/series/:id", async (req, res) => {
    try {
      const series = await storage.getSeriesById(req.params.id);
      if (!series) {
        return res.status(404).json({ message: "Series not found" });
      }
      res.json(series);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/series/:id/episodes", async (req, res) => {
    try {
      const episodes = await storage.getEpisodesBySeriesId(req.params.id);
      res.json(episodes);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const favorites = await storage.getUserFavorites(req.params.userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favorite = await storage.addFavorite(req.body);
      res.json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/favorites/:userId/:contentType/:contentId", async (req, res) => {
    try {
      const success = await storage.removeFavorite(
        req.params.userId,
        req.params.contentType,
        req.params.contentId
      );
      if (success) {
        res.json({ message: "Favorite removed" });
      } else {
        res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Watch History routes
  app.get("/api/watch-history/:userId", async (req, res) => {
    try {
      const history = await storage.getUserWatchHistory(req.params.userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/watch-history", async (req, res) => {
    try {
      const history = await storage.addWatchHistory(req.body);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/watch-history/:userId/:contentId", async (req, res) => {
    try {
      const { progress } = req.body;
      const success = await storage.updateWatchProgress(
        req.params.userId,
        req.params.contentId,
        progress
      );
      if (success) {
        res.json({ message: "Progress updated" });
      } else {
        res.status(404).json({ message: "Watch history not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // EPG routes
  app.get("/api/epg", async (req, res) => {
    try {
      const { channelId, date } = req.query;
      const programs = await storage.getEpgPrograms(
        channelId as string,
        date as string
      );
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/epg", async (req, res) => {
    try {
      const program = await storage.addEpgProgram(req.body);
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Playlist routes
  app.get("/api/playlists/:userId", async (req, res) => {
    try {
      const playlists = await storage.getUserPlaylists(req.params.userId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/playlists", async (req, res) => {
    try {
      const playlist = await storage.addPlaylist(req.body);
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/playlists/:id", async (req, res) => {
    try {
      const success = await storage.removePlaylist(req.params.id);
      if (success) {
        res.json({ message: "Playlist removed" });
      } else {
        res.status(404).json({ message: "Playlist not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Profile routes
  app.get("/api/user-profiles/:userId", async (req, res) => {
    try {
      const profiles = await storage.getUserProfiles(req.params.userId);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user-profiles", async (req, res) => {
    try {
      const profile = await storage.addUserProfile(req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/user-profiles/:id", async (req, res) => {
    try {
      const success = await storage.removeUserProfile(req.params.id);
      if (success) {
        res.json({ message: "Profile removed" });
      } else {
        res.status(404).json({ message: "Profile not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
