# remove all the lines with the field n/a by running on bash this command
# install.packages("gapminder")
# sed -n '/NA/!p' ./data/metrics.csv > /tmp/metrics.sort.uniq.csv



##########################
df <- read.csv("./data/metrics.csv", stringsAsFactors = T)
df <- subset(df, select = -contractAddress)
df <- subset(df, select = -version)
df <- subset(df, select = -rawVersion)
df <- subset(df, select = -bytecode)

# col_order <- c("total_lines",  "blanks", "functions", "payable", "events", "mapping", "modifiers", "contracts_definition", "addresses", "cyclomatic", "comments", "abiLength", "abiStringLength", "LOC")

# df2 <- df[, col_order]

library("gapminder")
library(dplyr)
library(tidyr)

sdf <-
  df %>%
  # Keep numeric variables
  select_if(is.numeric) %>%
  # gather variables
  gather(variable, value) %>%
  # Summarize by variable
  group_by(variable) %>%
  # summarise all columns
  summarise(
    # n = sum(!is.na(value)),
    `Mean` = mean(value, na.rm = TRUE),
    `Median` = median(value, na.rm = TRUE),
    `Std` = sd(value, na.rm = TRUE),
    `Min` = min(value, na.rm = TRUE),
    `Max` = max(value, na.rm = TRUE),
    `IQR` = IQR(value, type = 7, na.rm = TRUE),
    `10th` = quantile(value, probs = .1, na.rm = TRUE),
    `90th` = quantile(value, probs = .9, na.rm = TRUE),
  )


library(magrittr)
library("xtable")
foo <- xtable(sdf, digits = 0) %>%
  print(type = "latex",
        html.table.attributes = "",
        include.rownames = FALSE,
        format.args = list(big.mark = ","))
