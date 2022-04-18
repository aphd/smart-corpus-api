
# plot(cars, main = "Stopping Distance versus Speed")
# lines(stats::lowess(cars))
# head(cars)

library("poweRlaw")
DF <- read.csv("./data/metrics.sort.uniq.grep.csv")



plot_pl <- function(xname) {
  x <- DF[, xname] + 1

  #
  # plot(density(x), main = paste("Plot of", xname))
  hist(x, main = paste("Plot of", xname), border = F, breaks = 30, xlab = NULL)

  x_pl <- displ$new(x)
  x_pl$setPars(estimate_pars(x_pl))

  x_ln <- dislnorm$new(x)
  x_ln$setPars(estimate_pars(x_ln))

  x_ex <- disexp$new(x)
  x_ex$setPars(estimate_pars(x_ex))

  x_po <- dispois$new(x)
  x_po$setPars(estimate_pars(x_po))

  plot(x_ln, ylab = "P (X > x)", xlab = "", pch = 4, cex = 0.8)
  # lines(x_pl, col = "red")
  lines(x_ln, col = "green")
  lines(x_ex, col = "red")
  lines(x_po, col = "orange")
  labels <- c("Log-Normal", "Power-Law", "Poisson")
  legend("bottomleft", cex = .8, col = c("green", "red", "orange"), legend = labels, lwd = 2, bty = "n", y.intersp = 2)
}


main <- function() {

  # x_names <- c("abiLength", "comments", "total_lines", "bytecode")
  x_names <- c("abiLength")
  n_rows <- length(x_names)
  par(mfrow = c(n_rows, 2))
  # ex_3("total_lines")
  sapply(x_names, plot_pl)
}

main()
# plot_legend()
# plot_pl("total_lines")
