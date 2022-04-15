df = read.csv('../data/metrics.csv', stringsAsFactors=T)

plot_hist <- function(column_name) {
    tmp_df <- df[!df[[column_name]] == "n/a", ]
    x <- as.numeric(tmp_df[[column_name]])
    hist(x, breaks = 100, main = paste("Hist of", column_name), xlab = NULL )
}

main <- function() {
    nRow <- 4
    nCol <- 5
    notNames = "rawVersion|assemblyStatement|doWhileStatement|block|public|version|revertStatement|simpleStatement|tryStatement|whileStatement|isFallback|throwStatement|isVirtual|pure|payable|libraries|interfaces"
    par(mfrow = c(nRow, nCol))
    # layout(matrix(c(1,2,3,4), 2, 2, byrow = TRUE))
    names <- colnames(df)
    names <- names[!grepl(notNames, names)]
    sapply(names[0:(nRow * nCol)], plot_hist)
}
