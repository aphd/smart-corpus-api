#################################
######### LOAD CSV Data  ########
library("poweRlaw")
DF <- read.csv("./data/metrics.csv")
IMAGE_PATH <- "./docs/images/"

#################################
######### Plot Histogram  #######

plot_histo <- function(xname) {
  x <- DF[, xname] + 1
  png(file = paste(IMAGE_PATH,  xname, "-histo.png", sep = ""), width = 550, height = 450)
  hist(x,  main = xname, breaks = 150, xlab = NULL, xlim=c(0,20), cex.main=1.8, cex.axis=1.5, cex.lab=1.5, col = "grey",border = "grey")
  dev.off()
}
plot_histo("mapping")

#################################
######### Plot Power Law  #######
plot_pl <- function(xname) {
  x <- DF[, xname] + 1
  # x <- head(x, 1300)
  x <- x[!is.na(x)]

  x_pl <- displ$new(x)
  est <- estimate_xmin(x_pl)
  x_pl$setXmin(est)
  print(paste("\n\n*****************", est))
  x_pl$setPars(estimate_pars(x_pl))

  x_ln <- dislnorm$new(x)
  est <- estimate_xmin(x_ln)
  x_ln$setXmin(est)
  x_ln$setPars(estimate_pars(x_ln))

  # x_ex <- disexp$new(x)
  # x_ex$setPars(estimate_pars(x_ex))

  # x_po <- dispois$new(x)
  # x_po$setPars(estimate_pars(x_po))
  # dev.off()

  png(file = paste(IMAGE_PATH, "powerlaw-", xname, ".png", sep = ""), width = 550, height = 550)

  plot(main = xname, x_ln, ylab = "P (X > x)", xlab = "", pch = 4, cex = 0.8)
  lines(x_pl, col = "red")
  lines(x_ln, col = "green")
  # lines(x_ex, col = "blue")
  # lines(x_po, col = "orange")
  # labels <- c("Power Law", "Log-Normal", "Exponential")
  labels <- c("Power Law", "Log-Normal")
  legend("bottomleft", cex = 1.2, col = c("red", "green"), legend = labels, lwd = 2, bty = "n", y.intersp = 2)
  dev.off()
}
plot_pl("payable")

#################################
#########  Goodness_of_fit  #######
goodness_of_fit <- function(xname) {
  x <- DF[, xname] + 1
  x_pl <- displ$new(x)
  bs_p <- bootstrap_p(x_pl, no_of_sims = 1000, threads = 2)
  print(bs_p)
}
# goodness_of_fit("libraries")
