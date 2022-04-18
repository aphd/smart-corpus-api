library(ggplot2)
DF <- read.csv("./data/metrics.sort.uniq.csv", stringsAsFactors = T)
BIN_NUMS <- 100
NOT_NAMES <- "rawVersion|assemblyStatement|doWhileStatement|block|public|version|revertStatement|simpleStatement|tryStatement|whileStatement|isFallback|throwStatement|isVirtual|pure|payable|libraries|interfaces" # nolint
N_ROW <- 4
N_COL <- 5
par(mfrow = c(N_ROW, N_COL))
NAMES <- colnames(DF)
NAMES <- NAMES[!grepl(NOT_NAMES, NAMES)]
NAMES <- colnames(DF)[0:(N_ROW * N_COL)]

par(mfrow = c(1, 1))
NAMES <- c("total_lines")

get_data <- function(column_name) {
    tmp_df <- DF[!DF[[column_name]] == "n/a", ]
    return(as.numeric(tmp_df[[column_name]]))
}

plot_hist_by_column_name <- function(column_name) {
    x <- get_data(column_name)
    hist(x, breaks = 100, main = paste("Hist of", column_name), xlab = NULL)
}

plot_cdf_by_column_name <- function(column_name) {
    cbind_data <- get_cumulative_freq(column_name)
    y <- cbind_data[, "Cumul"]
    x <- seq(1, length(y), 1)
    plot(log(y), x, main = paste("Plot of", column_name))
}

plot_ccdf_by_column_name <- function(column_name) {
    # x <- sample.int(10, 100, replace = TRUE)
    p <- ggplot(DF, aes(column_name)) +
        stat_ecdf()
    pg <- ggplot_build(p)$data[[1]]
    ggplot(pg, aes(x = column_name, y = 1 - y)) +
        geom_step()
}

get_freq <- function(column_name) {
    data <- get_data(column_name)
    max_data <- max(data)
    min_data <- min(data)
    step <- (max_data - min_data) / BIN_NUMS
    p_breaks <- seq(min_data - 1, max_data + 1, by = step)
    freq <- data.frame(table(cut(data, breaks = p_breaks)))
    return(freq)
}

get_cumulative_freq <- function(column_name) {
    x <- get_data(column_name)
    par_2 <- cumsum(table(x))
    par_3 <- prop.table(table(x))
    out <- cbind(Freq = table(x), Cumul = par_2, relative = par_3)
    return(out)
}
plot_pmf <- function() {
    # probability mass function
    sapply(NAMES, plot_hist_by_column_name)
}

plot_cdf <- function() {
    # cumulative distribution function
    sapply(NAMES, plot_cdf_by_column_name)
}

plot_ccdf <- function() {
    # Complementary Cumulative Distribution Function
    sapply(NAMES, plot_ccdf_by_column_name)
}

plot_ccdf()
