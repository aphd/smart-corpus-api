# library(ggplot2)
# x <- sample.int(300, 1000, replace = TRUE)
# df <- data.frame(x)
# p <- ggplot(df, aes(x)) +
#   stat_ecdf()
# pg <- ggplot_build(p)$data[[1]]
# ggplot(pg, aes(x = x, y = 1 - y)) +
#   geom_point()
DF <- read.csv("./data/metrics.sort.uniq.csv", stringsAsFactors = T)


plot_ccdf <- function(column_name) {
  library(ggplot2)

  # x <- sample.int(10, 100, replace = TRUE)

  tmp_df <- DF[!DF[[column_name]] == "n/a", ]
  x <- as.numeric(tmp_df[[column_name]])
  df <- data.frame(x)
  # x <- sample.int(10, 100, replace = TRUE)
  p <- ggplot(df, aes(x)) +
    stat_ecdf()
  pg <- ggplot_build(p)$data[[1]]
  log.model.df <- data.frame(
    x = log(pg$x),
    y = log(1 - pg$y)
  )
  exp.model.df <- data.frame(
    x = log(pg$x),
    y = exp(1 - pg$y)
  )
  ggplot(pg, aes(x = log(x), y = log(1 - y))) +
    geom_point(colour = "black") +
    geom_smooth(data = log.model.df, aes(x, y, color = "Log Model"), size = 1, linetype = 1, se = FALSE) +
    geom_smooth(method = "lm", aes(color = "Exp Model"), formula = (y ~ exp(x)), se = FALSE, linetype = 1) +
    labs(title = column_name) +
    guides(color = guide_legend("Model Type"))
}

plot_exp <- function() {
  library(ggplot2)
  y <- 1:10
  x <- sapply(x, function(x) {
    exp(x / 10) + (runif(1) - .5) * x / 10
  })
  df <- data.frame(x, y)
  linear.model <- lm(y ~ x, df)
  log.model <- lm(log(y) ~ x, df)
  exp.model <- lm(y ~ exp(x), df)
  log.model.df <- data.frame(
    x = df$x,
    y = exp(fitted(log.model))
  )
  ggplot(df, aes(x = x, y = y)) +
    geom_point() +
    geom_smooth(method = "lm", aes(color = "Exp Model"), formula = (y ~ exp(x)), se = FALSE, linetype = 1) +
    geom_smooth(data = log.model.df, aes(x, y, color = "Log Model"), size = 1, linetype = 2) +
    geom_smooth(method = "lm", aes(color = "Lin Model"), formula = (y ~ x), se = FALSE, linetype = 1) +
    guides(color = guide_legend("Model Type"))
}

plot_gg <- function() {
  ggplot(data = BOD, mapping = aes(x = Time, y = demand)) +
    geom_point(size = 2) +
    geom_line(colour = "red")
}

plot_multi <- function() {
  library(ggplot2)
  library(patchwork)

  p1 <- ggplot(mtcars) +
    geom_point(aes(mpg, disp))
  p2 <- ggplot(mtcars) +
    geom_boxplot(aes(gear, disp, group = gear))

  (p1 + p2) / (p1 + p2) + plot_annotation(title = "My title") &
    theme(plot.title = element_text(hjust = 0.5))
}



# plot_gg()

plot_ccdf("addresses")
# plot_exp()
# plot_ccdf("bytecode")
