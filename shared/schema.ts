import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  plan: text("plan").notNull().default("basic"),
  avatarUrl: text("avatar_url"),
  preferences: jsonb("preferences").$type<{
    language: string;
    subtitle: boolean;
    quality: string;
  }>(),
  parentalPin: text("parental_pin"),
  theme: text("theme").default("dark"),
  isParent: boolean("is_parent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const channels = pgTable("channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  logoUrl: text("logo_url"),
  streamUrl: text("stream_url").notNull(),
  isLive: boolean("is_live").default(true),
  viewers: integer("viewers").default(0),
  currentShow: text("current_show"),
  nextShow: text("next_show"),
  timeRemaining: text("time_remaining"),
  streamType: text("stream_type").default("hls"),
  countryCode: text("country_code"),
  ageRating: integer("age_rating").default(0),
  isCatchupEnabled: boolean("is_catchup_enabled").default(false),
  epgChannelId: text("epg_channel_id"),
});

export const movies = pgTable("movies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  year: integer("year").notNull(),
  genre: text("genre").notNull(),
  rating: text("rating"),
  imdbRating: text("imdb_rating"),
  duration: integer("duration"), // in minutes
  posterUrl: text("poster_url"),
  backdropUrl: text("backdrop_url"),
  videoUrl: text("video_url"),
  quality: text("quality").default("HD"),
  isFeatured: boolean("is_featured").default(false),
});

export const series = pgTable("series", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  year: integer("year").notNull(),
  genre: text("genre").notNull(),
  rating: text("rating"),
  imdbRating: text("imdb_rating"),
  seasons: integer("seasons").notNull(),
  episodes: integer("episodes").notNull(),
  posterUrl: text("poster_url"),
  backdropUrl: text("backdrop_url"),
  status: text("status").default("ongoing"), // ongoing, completed
});

export const episodes = pgTable("episodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seriesId: varchar("series_id").references(() => series.id),
  season: integer("season").notNull(),
  episode: integer("episode").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // in minutes
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  contentType: text("content_type").notNull(), // channel, movie, series
  contentId: varchar("content_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const watchHistory = pgTable("watch_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  contentType: text("content_type").notNull(), // channel, movie, series, episode
  contentId: varchar("content_id").notNull(),
  progress: integer("progress").default(0), // percentage
  duration: integer("duration"), // total duration in seconds
  watchedAt: timestamp("watched_at").defaultNow(),
});

export const epgPrograms = pgTable("epg_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar("channel_id").references(() => channels.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  category: text("category"),
  ageRating: integer("age_rating").default(0),
  isCatchupAvailable: boolean("is_catchup_available").default(false),
});

export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  url: text("url"),
  type: text("type").notNull(), // m3u, xtream
  username: text("username"),
  password: text("password"),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  profileName: text("profile_name").notNull(),
  avatarUrl: text("avatar_url"),
  ageRating: integer("age_rating").default(18),
  pin: text("pin"),
  isChild: boolean("is_child").default(false),
  preferences: jsonb("preferences").$type<{
    language: string;
    subtitle: boolean;
    quality: string;
    autoplay: boolean;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChannelSchema = createInsertSchema(channels).omit({
  id: true,
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
});

export const insertSeriesSchema = createInsertSchema(series).omit({
  id: true,
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  addedAt: true,
});

export const insertWatchHistorySchema = createInsertSchema(watchHistory).omit({
  id: true,
  watchedAt: true,
});

export const insertEpgProgramSchema = createInsertSchema(epgPrograms).omit({
  id: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  lastUpdated: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Channel = typeof channels.$inferSelect;

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Series = typeof series.$inferSelect;

export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodes.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type InsertWatchHistory = z.infer<typeof insertWatchHistorySchema>;
export type WatchHistory = typeof watchHistory.$inferSelect;

export type InsertEpgProgram = z.infer<typeof insertEpgProgramSchema>;
export type EpgProgram = typeof epgPrograms.$inferSelect;

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
