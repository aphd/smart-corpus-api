
# plot(cars, main = "Stopping Distance versus Speed")
# lines(stats::lowess(cars))
# head(cars)

library("poweRlaw")
DF <- read.csv("./data/metrics.sort.uniq.grep.csv")
IMAGE_PATH <- "./docs/images/"



plot_pl <- function(xname) {
  x <- DF[, xname] + 1

  png(file = paste(IMAGE_PATH, "histo-", xname, ".png", sep = ""), width = 250, height = 550)
  #
  hist(x, main = xname, border = F, breaks = 30, xlab = NULL)

  x_pl <- displ$new(x)
  est <- estimate_xmin(x_pl)
  x_pl$setXmin(est)
  print(paste("\n\n*****************", est))
  x_pl$setPars(estimate_pars(x_pl))

  x_ln <- dislnorm$new(x)
  est <- estimate_xmin(x_ln)
  x_ln$setXmin(est)
  x_ln$setPars(estimate_pars(x_ln))

  x_ex <- disexp$new(x)
  x_ex$setPars(estimate_pars(x_ex))

  x_po <- dispois$new(x)
  x_po$setPars(estimate_pars(x_po))
  dev.off()

  png(file = paste(IMAGE_PATH, "powerlaw-", xname, ".png", sep = ""), width = 550, height = 550)

  plot(main = xname, x_ln, ylab = "P (X > x)", xlab = "", pch = 4, cex = 0.8)
  lines(x_pl, col = "red")
  lines(x_ln, col = "green")
  lines(x_ex, col = "blue")
  lines(x_po, col = "orange")
  labels <- c("Power Law", "Log-Normal", "Exponential", "Poisson")
  legend("bottomleft", cex = 1.2, col = c("red", "green", "blue", "orange"), legend = labels, lwd = 2, bty = "n", y.intersp = 2)
  dev.off()
}


main <- function() {
  # x_names <- c("events", "abiLength", "comments", "total_lines", "bytecode", "modifiers")
  x_names <- c("libraries")
  n_rows <- length(x_names)
  par(mfrow = c(n_rows, 2))
  # ex_3("total_lines")
  sapply(x_names, plot_pl)
}

goodness_of_fit <- function(xname) {
  x <- DF[, xname] + 1
  x_pl <- displ$new(x)
  bs_p <- bootstrap_p(x_pl, no_of_sims = 1000, threads = 2)
  print(bs_p)
}
goodness_of_fit("libraries")
# main()
# plot_legend()
# plot_pl("total_lines")
