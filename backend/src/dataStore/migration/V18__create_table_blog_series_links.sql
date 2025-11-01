CREATE TABLE IF NOT EXISTS blog_series_links (
  seriesId CHAR(36) NOT NULL,
  blogId CHAR(36) NOT NULL,
  position INT NOT NULL,
  PRIMARY KEY (seriesId, blogId),
  UNIQUE KEY unique_series_position (seriesId, position),
  FOREIGN KEY (seriesId) REFERENCES blog_series(id) ON DELETE CASCADE,
  FOREIGN KEY (blogId) REFERENCES blogs(id) ON DELETE CASCADE
)