DF = read.csv('./data/metrics.csv', stringsAsFactors=T)
BIN_NUMS = 100

get_data <- function(column_name) {
    tmp_df <- DF[!DF[[column_name]] == "n/a", ]
    return(as.numeric(tmp_df[[column_name]]))
}

plot_hist_by_column_name <- function(column_name) {
    x = get_data(column_name)
    hist(x, breaks = 100, main = paste("Hist of", column_name), xlab = NULL )
}

plot_hist <- function() {
    nRow <- 4
    nCol <- 5
    notNames = "rawVersion|assemblyStatement|doWhileStatement|block|public|version|revertStatement|simpleStatement|tryStatement|whileStatement|isFallback|throwStatement|isVirtual|pure|payable|libraries|interfaces"
    par(mfrow = c(nRow, nCol))
    # layout(matrix(c(1,2,3,4), 2, 2, byrow = TRUE))
    names <- colnames(df)
    names <- names[!grepl(notNames, names)]
    sapply(names[0:(nRow * nCol)], plot_hist_by_column_name)
}

plot_pow_by_column_name <- function(column_name) {
    cbindData = get_cumulative_freq(column_name)
    y <- cbindData[,"Cumul"]
    x <- seq(1, length(y), 1)
    plot(log(y), x, main=paste("Plot of", column_name))
}

get_freq <- function(column_name) {
    data = get_data(column_name)
    maxData = max(data) 
    minData = min(data) 
    step = (maxData - minData) / BIN_NUMS 
    freq = data.frame(table(cut(data, breaks=seq(minData - 1, maxData + 1 , by = step  ))))
    return(freq)
}

get_cumulative_freq <- function(column_name) {
    x <- get_data(column_name)
    cbindData <- cbind( Freq=table(x), Cumul=cumsum(table(x)), relative=prop.table(table(x)))
    return(cbindData)
}

plot_pow <- function() {
    # column_name = "ifStatement"
    # plot_pow_by_column_name(column_name)
    nRow <- 4
    nCol <- 5
    notNames = "rawVersion|assemblyStatement|doWhileStatement|block|public|version|revertStatement|simpleStatement|tryStatement|whileStatement|isFallback|throwStatement|isVirtual|pure|payable|libraries|interfaces"
    par(mfrow = c(nRow, nCol))
    names <- colnames(DF)
    names <- names[!grepl(notNames, names)]
    sapply(names[0:(nRow * nCol)], plot_pow_by_column_name)
}

plot_pow()
