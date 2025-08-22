import { type User, type InsertUser, type Channel, type InsertChannel, type Movie, type InsertMovie, type Series, type InsertSeries, type Episode, type InsertEpisode, type Favorite, type InsertFavorite, type WatchHistory, type InsertWatchHistory, type EpgProgram, type InsertEpgProgram, type Playlist, type InsertPlaylist, type UserProfile, type InsertUserProfile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Channel methods
  getChannels(): Promise<Channel[]>;
  getChannelsByCategory(category: string): Promise<Channel[]>;
  getChannel(id: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;

  // Movie methods
  getMovies(): Promise<Movie[]>;
  getFeaturedMovies(): Promise<Movie[]>;
  getMovie(id: string): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;

  // Series methods
  getSeries(): Promise<Series[]>;
  getSeriesById(id: string): Promise<Series | undefined>;
  createSeries(series: InsertSeries): Promise<Series>;

  // Episode methods
  getEpisodesBySeriesId(seriesId: string): Promise<Episode[]>;
  getEpisode(id: string): Promise<Episode | undefined>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;

  // Favorites methods
  getUserFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, contentType: string, contentId: string): Promise<boolean>;

  // Watch History methods
  getUserWatchHistory(userId: string): Promise<WatchHistory[]>;
  addWatchHistory(watchHistory: InsertWatchHistory): Promise<WatchHistory>;
  updateWatchProgress(userId: string, contentId: string, progress: number): Promise<boolean>;

  // EPG methods
  getEpgPrograms(channelId?: string, date?: string): Promise<EpgProgram[]>;
  addEpgProgram(program: InsertEpgProgram): Promise<EpgProgram>;

  // Playlist methods
  getUserPlaylists(userId: string): Promise<Playlist[]>;
  addPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  removePlaylist(id: string): Promise<boolean>;
  updatePlaylist(id: string, playlist: Partial<InsertPlaylist>): Promise<boolean>;

  // User Profile methods
  getUserProfiles(userId: string): Promise<UserProfile[]>;
  addUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  removeUserProfile(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private channels: Map<string, Channel>;
  private movies: Map<string, Movie>;
  private series: Map<string, Series>;
  private episodes: Map<string, Episode>;
  private favorites: Map<string, Favorite>;
  private watchHistory: Map<string, WatchHistory>;
  private epgPrograms: Map<string, EpgProgram>;
  private playlists: Map<string, Playlist>;
  private userProfiles: Map<string, UserProfile>;

  constructor() {
    this.users = new Map();
    this.channels = new Map();
    this.movies = new Map();
    this.series = new Map();
    this.episodes = new Map();
    this.favorites = new Map();
    this.watchHistory = new Map();
    this.epgPrograms = new Map();
    this.playlists = new Map();
    this.userProfiles = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock user
    const mockUser: User = {
      id: "user-1",
      username: "john_doe",
      email: "john@example.com",
      password: "password123",
      plan: "Premium Plan",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
      preferences: {
        language: "en",
        subtitle: true,
        quality: "4K"
      },
      createdAt: new Date()
    };
    this.users.set(mockUser.id, mockUser);

    // No mock channels - will be loaded from user's playlists

    // No mock movies - will be loaded from user's playlists

    // No mock series - will be loaded from user's playlists

    // No mock watch history - will be created as user watches content

    // Create mock EPG programs
    const today = new Date();
    const mockEpgPrograms: EpgProgram[] = [
      {
        id: "epg-1",
        channelId: "channel-1",
        title: "Morning News Update",
        description: "Latest news and weather updates",
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        category: "News",
        ageRating: 0,
        isCatchupAvailable: true,
      },
      {
        id: "epg-2", 
        channelId: "channel-2",
        title: "NBA Game of the Week",
        description: "Live basketball action",
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0),
        category: "Sports",
        ageRating: 0,
        isCatchupAvailable: false,
      },
    ];

    mockEpgPrograms.forEach(program => this.epgPrograms.set(program.id, program));

    // Create mock user profiles
    const mockProfiles: UserProfile[] = [
      {
        id: "profile-1",
        userId: "user-1",
        profileName: "John (Adult)",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        ageRating: 18,
        pin: null,
        isChild: false,
        preferences: {
          language: "en",
          subtitle: true,
          quality: "4K",
          autoplay: true,
        },
        createdAt: new Date(),
      },
      {
        id: "profile-2",
        userId: "user-1",
        profileName: "Kids",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        ageRating: 7,
        pin: "1234",
        isChild: true,
        preferences: {
          language: "en",
          subtitle: false,
          quality: "HD",
          autoplay: false,
        },
        createdAt: new Date(),
      },
    ];

    mockProfiles.forEach(profile => this.userProfiles.set(profile.id, profile));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      plan: insertUser.plan || "basic",
      avatarUrl: insertUser.avatarUrl || null,
      preferences: insertUser.preferences || null,
      parentalPin: insertUser.parentalPin || null,
      theme: insertUser.theme || "dark",
      isParent: insertUser.isParent || false,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values());
  }

  async getChannelsByCategory(category: string): Promise<Channel[]> {
    return Array.from(this.channels.values()).filter(
      channel => channel.category === category
    );
  }

  async getChannel(id: string): Promise<Channel | undefined> {
    return this.channels.get(id);
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const id = randomUUID();
    const channel: Channel = { 
      ...insertChannel, 
      id,
      description: insertChannel.description || null,
      logoUrl: insertChannel.logoUrl || null,
      isLive: insertChannel.isLive ?? true,
      viewers: insertChannel.viewers ?? 0,
      currentShow: insertChannel.currentShow || null,
      nextShow: insertChannel.nextShow || null,
      timeRemaining: insertChannel.timeRemaining || null,
      streamType: insertChannel.streamType || "hls",
      countryCode: insertChannel.countryCode || null,
      ageRating: insertChannel.ageRating ?? 0,
      isCatchupEnabled: insertChannel.isCatchupEnabled ?? false,
      epgChannelId: insertChannel.epgChannelId || null,
    };
    this.channels.set(id, channel);
    return channel;
  }

  async getMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }

  async getFeaturedMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values()).filter(movie => movie.isFeatured);
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const movie: Movie = { 
      ...insertMovie, 
      id,
      description: insertMovie.description || null,
      rating: insertMovie.rating || null,
      imdbRating: insertMovie.imdbRating || null,
      duration: insertMovie.duration || null,
      posterUrl: insertMovie.posterUrl || null,
      backdropUrl: insertMovie.backdropUrl || null,
      videoUrl: insertMovie.videoUrl || null,
      quality: insertMovie.quality || "HD",
      isFeatured: insertMovie.isFeatured ?? false,
    };
    this.movies.set(id, movie);
    return movie;
  }

  async getSeries(): Promise<Series[]> {
    return Array.from(this.series.values());
  }

  async getSeriesById(id: string): Promise<Series | undefined> {
    return this.series.get(id);
  }

  async createSeries(insertSeries: InsertSeries): Promise<Series> {
    const id = randomUUID();
    const series: Series = { 
      ...insertSeries, 
      id,
      description: insertSeries.description || null,
      rating: insertSeries.rating || null,
      imdbRating: insertSeries.imdbRating || null,
      posterUrl: insertSeries.posterUrl || null,
      backdropUrl: insertSeries.backdropUrl || null,
      status: insertSeries.status || "ongoing",
    };
    this.series.set(id, series);
    return series;
  }

  async getEpisodesBySeriesId(seriesId: string): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(
      episode => episode.seriesId === seriesId
    );
  }

  async getEpisode(id: string): Promise<Episode | undefined> {
    return this.episodes.get(id);
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const id = randomUUID();
    const episode: Episode = { 
      ...insertEpisode, 
      id,
      description: insertEpisode.description || null,
      duration: insertEpisode.duration || null,
      videoUrl: insertEpisode.videoUrl || null,
      seriesId: insertEpisode.seriesId || null,
      thumbnailUrl: insertEpisode.thumbnailUrl || null,
    };
    this.episodes.set(id, episode);
    return episode;
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(
      favorite => favorite.userId === userId
    );
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = randomUUID();
    const favorite: Favorite = { 
      ...insertFavorite, 
      id, 
      userId: insertFavorite.userId || null,
      addedAt: new Date() 
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async removeFavorite(userId: string, contentType: string, contentId: string): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      f => f.userId === userId && f.contentType === contentType && f.contentId === contentId
    );
    if (favorite) {
      this.favorites.delete(favorite.id);
      return true;
    }
    return false;
  }

  async getUserWatchHistory(userId: string): Promise<WatchHistory[]> {
    return Array.from(this.watchHistory.values()).filter(
      history => history.userId === userId
    );
  }

  async addWatchHistory(insertWatchHistory: InsertWatchHistory): Promise<WatchHistory> {
    const id = randomUUID();
    const watchHistory: WatchHistory = { 
      ...insertWatchHistory, 
      id, 
      userId: insertWatchHistory.userId || null,
      progress: insertWatchHistory.progress ?? 0,
      duration: insertWatchHistory.duration || null,
      watchedAt: new Date() 
    };
    this.watchHistory.set(id, watchHistory);
    return watchHistory;
  }

  async updateWatchProgress(userId: string, contentId: string, progress: number): Promise<boolean> {
    const history = Array.from(this.watchHistory.values()).find(
      h => h.userId === userId && h.contentId === contentId
    );
    if (history) {
      history.progress = progress;
      this.watchHistory.set(history.id, history);
      return true;
    }
    return false;
  }

  // EPG methods
  async getEpgPrograms(channelId?: string, date?: string): Promise<EpgProgram[]> {
    let programs = Array.from(this.epgPrograms.values());
    
    if (channelId) {
      programs = programs.filter(program => program.channelId === channelId);
    }
    
    if (date) {
      const targetDate = new Date(date);
      programs = programs.filter(program => {
        const programDate = new Date(program.startTime);
        return programDate.toDateString() === targetDate.toDateString();
      });
    }
    
    return programs.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async addEpgProgram(insertProgram: InsertEpgProgram): Promise<EpgProgram> {
    const id = randomUUID();
    const program: EpgProgram = { 
      ...insertProgram, 
      id,
      description: insertProgram.description || null,
      category: insertProgram.category || null,
      ageRating: insertProgram.ageRating ?? 0,
      isCatchupAvailable: insertProgram.isCatchupAvailable ?? false,
    };
    this.epgPrograms.set(id, program);
    return program;
  }

  // Playlist methods
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(
      playlist => playlist.userId === userId
    );
  }

  async addPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id,
      userId: insertPlaylist.userId || null,
      url: insertPlaylist.url || null,
      username: insertPlaylist.username || null,
      password: insertPlaylist.password || null,
      isActive: insertPlaylist.isActive ?? true,
      lastUpdated: new Date() 
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async removePlaylist(id: string): Promise<boolean> {
    return this.playlists.delete(id);
  }

  async updatePlaylist(id: string, updates: Partial<InsertPlaylist>): Promise<boolean> {
    const playlist = this.playlists.get(id);
    if (playlist) {
      const updatedPlaylist = { ...playlist, ...updates, lastUpdated: new Date() };
      this.playlists.set(id, updatedPlaylist);
      return true;
    }
    return false;
  }

  // User Profile methods
  async getUserProfiles(userId: string): Promise<UserProfile[]> {
    return Array.from(this.userProfiles.values()).filter(
      profile => profile.userId === userId
    );
  }

  async addUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const id = randomUUID();
    const profile: UserProfile = { 
      ...insertProfile, 
      id,
      userId: insertProfile.userId || null,
      avatarUrl: insertProfile.avatarUrl || null,
      ageRating: insertProfile.ageRating ?? 18,
      pin: insertProfile.pin || null,
      isChild: insertProfile.isChild ?? false,
      preferences: insertProfile.preferences || null,
      createdAt: new Date() 
    };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async removeUserProfile(id: string): Promise<boolean> {
    return this.userProfiles.delete(id);
  }
}

export const storage = new MemStorage();
